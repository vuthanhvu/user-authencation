const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Please tell me email'],
        unique: true,
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    passwordConfirm: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
