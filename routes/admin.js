var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/logged',  function(req, res, next) {
    
    if(!req.user || !req.session){
    
            var err = new Error('You must be logged in as admin to view this page.');
            err.status = 401;
            return next(err);
    }else if(req.user.username !=='admin'){
        
            var err = new Error('You must be logged in as admin to view this page.');
            err.status = 401;
            return next(err);
        
    }else {
        
        //Write code here for displaying and deletion of users and rides.
        
            User.find({username: req.user.username}, function(err, docs){
            console.log(docs)
            if (err) {console.log("user not found"); res.status(404).send();}
            else{
                res.render('logged',{user: {"firstname": docs[0].firstname.toString(), "lastname": docs[0].lastname.toString(), "username": docs[0].username.toString(), "email": docs[0].email.toString(),"phone": docs[0].phone.toString() }});
            }
        });
        
        
        
        
    }
    
      //console.log(req.body.firstname);

});

module.exports = router;