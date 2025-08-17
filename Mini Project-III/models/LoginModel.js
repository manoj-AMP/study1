const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    loginTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("LOGDB", loginSchema);
