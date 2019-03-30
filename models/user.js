const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    profileimage: {
        type: String
    },
    hash: {
        type: Object
    }
});

// Reservations will be embedded in the Restaurant model

const User = mongoose.model('User', UserSchema);

module.exports = { User };
