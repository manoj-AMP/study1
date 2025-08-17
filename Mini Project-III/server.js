const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3020;

const SignupModel = require('./models/SignupModel');
const LoginModel = require('./models/LoginModel');

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/DBUSER', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connected successfully");
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Signup Route
app.post('/post', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password.length < 8 || password.length > 20) {
        return res.send("Password must be between 8 and 20 characters.");
    }

    if (password !== confirmPassword) {
        return res.send("Passwords do not match.");
    }

    const existingUser = await SignupModel.findOne({ email: email });
    if (existingUser) {
        return res.send("User already registered with this email.");
    }

    const user = new SignupModel({
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    });

    try {
        await user.save();
        res.send("Signup Successful! Please <a href='/login'>login</a>.");
    } catch (err) {
        res.status(500).send("Error saving user.");
    }
});

// Login Route
app.post('/loginpost', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await SignupModel.findOne({ email: username });

        if (!user) {
            return res.send("User not found. Please <a href='/'>sign up</a> first.");
        }

        if (user.password !== password) {
            return res.send("Incorrect password. Try again.");
        }

        const loginEntry = new LoginModel({ username, password });
        await loginEntry.save();

        res.redirect('/home');
    } catch (err) {
        res.status(500).send("Error during login.");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
