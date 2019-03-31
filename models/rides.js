var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload  = multer({dest:'./uploads/'});

const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    carType: {
        type: String,
    },
    origin: {
        {type: Double, type: Double}
    },
    destination: {
        type: String
    },
    seatsOccupied: {
        type: Number
    },
    departureTime: {
        type: String
    },
    cost: {
        type: Double
    }
});

const User = mongoose.model('Ride', UserSchema);

module.exports = { Ride };
