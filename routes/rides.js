var express = require('express');
var router = express.Router();
var SSE = require('express-sse');

const { ObjectID } = require('mongodb')
const { mongoose } = require('mongoose');

const { Ride } = require('../models/rides');
const { RideSearch } = require('../models/rides_search');

var sse = new SSE();
var searched = false;

router.get('/stream', sse.init);

/* Listen for database changes */
Ride.watch({fullDocument: 'updateLookup'}).
    on('change', data => {
      console.log(data);
      sse.send(data);
});

router.get('/own', function(req, res, next) {

   if(!req.user){
        res.location('/users/login');
        res.redirect('/users/login');
    }

  res.sendfile('./public/your_rides.html');
});


router.get('/admin', function(req, res, next) {

    if(!req.user || !req.session){

            var err = new Error('You must be logged in as admin to view this page.');
            err.status = 401;
            return next(err);
    }else if(req.user.username !=='admin'){

            var err = new Error('You must be logged in as admin to view this page.');
            err.status = 401;
            return next(err);

    }else {
    res.sendfile('./public/view_rides_admin.html');
    }
});





router.get('/profilepic.jpeg', function(req, res){

    res.sendfile(path.resolve(path.resolve(__dirname,'profilepic.jpeg')));
  //res.sendfile('/img/profilepic.jpeg');
  //res.send("Hello");

});

/* GET users listing. */
router.get('/search', function(req, res, next) {


   if(!req.user){
        res.location('/users/login');
        res.redirect('/users/login');
    }
   res.render('search_rides',{
     title  : 'Search rides',
     errors: req.flash('error')
   });


  //res.sendfile('./public/main_page.html');
  //res.render(search_rides);
});

router.get('/ridesearch/:owner', function(req, res, next) {
  const ownerUsername = req.params.owner;

  RideSearch.find({owner: ownerUsername}).then((rides) => {
    res.send(rides[0]);
  }).catch((error) => {
    res.status(500).send()
  })
})


router.get('/create', function(req, res, next) {

    if(!req.user){
        res.location('/users/login');
        res.redirect('/users/login');
    }

  res.sendfile('./public/create_ride.html');

});

router.get('/view', function(req, res, next) {

    //console.log("VIEW RIDES PAGE");
   if(!req.user || !searched){
        res.location('/rides/search');
        res.redirect('/rides/search');
    }
   searched = false;

  res.sendfile('./public/view_rides.html');
});

router.post('/create', function(req, res, next) {
  const ride = new Ride({
    owner: req.user.username,
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

router.post('/search', function(req, res, next) {
  const ride = new RideSearch({
    origin: req.body.origin,
    destination: req.body.destination,
    seatsOccupied: req.body.seatsOccupied,
      owner: req.user.username
  })

  searched = true;

  ride.save().then((result) => {
    res.send(result)
  }, (error) => {
		res.status(400).send(error)
  })

  //res.location('/rides/view');
  //res.redirect('/rides/view');



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

router.delete('/ridesearch/:id', (req, res) => {
  const id = req.params.id;

  RideSearch.findByIdAndDelete(id).then((rideQuery) => {
    res.send(rideQuery);
  }, (notfound) => {
    res.status(404).send();
  }).catch((error) => {
    res.status(500).send();
  })
})

module.exports = router;
