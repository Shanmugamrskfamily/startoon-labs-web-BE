const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role:{type: String, enum: ['Admin', 'User']},
    password: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'], required: true },
    count: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);