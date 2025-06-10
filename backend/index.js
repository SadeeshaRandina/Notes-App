require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

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
app.post('/api/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;
    const User = require('./models/user.model');

    try {
        const user = new User({ fullName, email, password });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
});

app.listen(8000);

module.exports = app;