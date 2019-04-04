const log = console.log
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_zlpdsrkk:v18bops13jcmokef4cpquls8v4@ds127646.mlab.com:27646/heroku_zlpdsrkk');

const RideSchema = new mongoose.Schema({
    members: {
      type: [String]
    },
    owner: {
      type: String
    },
    carType: {
        type: String,
    },
    origin: {
      type: String
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
        type: Number
    }
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = { Ride };
