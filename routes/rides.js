var express = require('express');
var router = express.Router();

const { ObjectID } = require('mongodb')
const { mongoose } = require('mongoose');

const { Ride } = require('../models/rides');

/* GET users listing. */
router.get('/search', function(req, res, next) {
  res.sendfile('./public/main_page.html');
});

router.get('/create', function(req, res, next) {
  res.sendfile('./public/create_ride.html');
});

router.get('/view', function(req, res, next) {
  res.sendfile('./public/view_rides.html');
});

router.post('/', function(req, res, next) {
  const ride = new Ride({
    owner: req.body.owner,
    members: req.body.members,
    carType: req.body.carType,
    origin: req.body.origin,
    destination: req.body.destination,
    seatsOccupied: req.body.seatsOccupied,
    departureTime: req.body.departureTime,
    cost: req.body.cost
  })

  ride.save().then((result) => {
    res.send(result)
  }, (error) => {
		res.status(400).send(error)
  })
})

router.put('/:id', (req, res) => {
  const id = req.params.id;

  const updatedRide = {
    owner: req.body.owner,
    members: req.body.members,
    carType: req.body.carType,
    origin: req.body.origin,
    destination: req.body.destination,
    seatsOccupied: req.body.seatsOccupied,
    departureTime: req.body.departureTime,
    cost: req.body.cost
  }

  Ride.findOneAndUpdate({_id: ObjectID(id)}, updatedRide).then((ride) =>{
    res.send(ride);
  }, (error) => {
    res.status(404).send()
  }).catch((error) => {
    res.status(500).send()
  })
})

/* Gets all rides */
router.get('/', (req, res) => {
  Ride.find({}).then((rides) => {
    res.send(rides);
  }).catch((error) => {
    res.status(500).send()
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Ride.findById(id).then((ride) => {
    if (!ride) {
      res.status(404).send();
    }
    else {
      res.send(ride);
    }
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Ride.findByIdAndDelete(id).then((ride) => {
    res.send(ride);
  }, (notfound) => {
    res.status(404).send();
  }).catch((error) => {
    res.status(500).send();
  })
})

module.exports = router;
