const log = console.log
var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

const RideSearchSchema = new mongoose.Schema({
    origin: {
      type: String
    },
    destination: {
        type: String
    },
    seatsOccupied: {
        type: Number
    }
});

const RideSearch = mongoose.model('RideSearch', RideSearchSchema);

module.exports = { RideSearch };
