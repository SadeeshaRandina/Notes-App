require('dotenv').config(); 
const config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');

const express = require('express');
const cors = require('cors');
const app = express();


const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get('/', (req, res) => {
    res.send({data: 'Hello!'});
});

// Create Account
app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName){
        return res
            .status(400)
            .json({ error: 'Full name is required' });
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: 'Email is required' });
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: 'Password is required' });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: 'User already exists with this email',
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

    const accessToken = jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '36000m' }
    );

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'User created successfully',
    });
});

app.listen(8000);

module.exports = app;