const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String
});

module.exports = mongoose.model("SignupData", signupSchema);