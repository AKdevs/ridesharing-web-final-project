var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload  = multer({dest:'./uploads/'});
const bcrypt = require('bcrypt');


const { Ride } = require('../models/ride');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

router.get('/mainride', function(req, res, next) {
  res.sendfile('./public/main_page.html');
});

router.post('/createride', function(req, res, next) {
  res.sendfile('./public/create_ride.html');
});

router.get('/viewrides', function(req, res, next) {
  res.sendfile('./public/view_rides.html');
});

module.exports = router;
