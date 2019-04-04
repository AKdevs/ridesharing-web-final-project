const log = console.log
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

//mongoose.connect('mongodb://heroku_zlpdsrkk:v18bops13jcmokef4cpquls8v4@ds127646.mlab.com:27646/heroku_zlpdsrkk');

const RideSearchSchema = new mongoose.Schema({
    origin: {
      type: String
    },
    destination: {
        type: String
    },
    seatsOccupied: {
        type: Number
    },
    owner: {
        type: String
    }
});

const RideSearch = mongoose.model('RideSearch', RideSearchSchema);

module.exports = { RideSearch };
