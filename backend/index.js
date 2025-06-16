require('dotenv').config(); 
const config = require('./config');
const mongoose = require('mongoose');

// Connect to MongoDB with proper error handling
mongoose.connect(config.connectionString)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

// Middleware order is important
app.use(cors({
    origin: "*",
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

app.get('/', (req, res) => {
    res.send({data: 'Hello!'});
});

// Create Account
app.post('/create-account', async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400)
        .json({ error: true, message: 'Full name is required' });
    }

    if (!email) {
        return res.status(400)
        .json({ error: true, message: 'Email is required' });
    }

    if (!password) {
        return res.status(400)
        .json({ error: true, message: 'Password is required' });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.json({
            error: true,
            message: 'User already exists'
        });
    }

    const user = new User({
        fullName,
        email,
        password
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '36000m', 
    });

    res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration successful'
    });
    
});

// Login
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400)
        .json({ message: 'Email is required' });
    }

    if (!password) {
        return res.status(400)
        .json({ message: 'Password is required' });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.json({ message: 'User does not exist'});
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = {user: userInfo};
        const accessToken = jwt.sign( user , process.env.ACCESS_TOKEN_SECRET, { 
            expiresIn: '36000m', 
        });

        return res.json({
            error: false,
            message: 'Login successful',
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message: 'Invalid credentials'
        });
    }
});

// Get User
app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.status(401);
    }

    return res.json({
        user: {fullName: isUser.fullName, 
            email: isUser.email, 
            _id: isUser._id, 
            createdAt: isUser.createdAt},
        message: 'User retrieved successfully',
    });
});

// Add Note
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });

        await note.save();

        res.json({
            error: false,
            note,
            message: 'Note added successfully'
            
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error adding note',
        });
    }   
});

// Edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res
        .status(400)
        .json({ error: true, message: 'No changes provided' });
    }

    try {
        const note = await Note.findOne(
            { _id: noteId, userId: user._id },
        );

        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        res.json({
            error: false,
            note,
            message: 'Note updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error updating note',
        });
    }
});

// Get all notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: 'All Notes retrieved successfully'
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error retrieving notes',
        });
    }  
});

// Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }   

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error deleting note',
        });
    }
});

// Update isPinned
app.put('/update-is-pinned/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne(
            { _id: noteId, userId: user._id },
        );

        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }

        note.isPinned = isPinned;

        await note.save();

        res.json({
            error: false,
            note,
            message: 'Note pinned successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error updating note',
        });
    }
});



app.listen(8000, () => {
    console.log('Server running on port 8000');
});

module.exports = app;