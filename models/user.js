const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    googleAuth: {
        id: {
            type: String,
            required: true,
        },
        name: String,
        email: String,
        avatar: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);