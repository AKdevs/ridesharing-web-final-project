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

router.post('/logged', function(req,res,next) {
    // console.log(req.body); fetch data from request body 
    User.findOneAndRemove({username: req.body['User Name']}, function(err, user) {
        console.log(user);
        if(err){
            console.log("User not found");
            return next(err);
        }
        else{
            User.find().then((docs) => {
            console.log(docs.length);
            var docwithoutAdmin =[];
            for (var i=0; i<docs.length;i++)
            {
                if(docs[i].username != "admin")
                {
                    docwithoutAdmin.push(docs[i])
                }
            }
            res.render('logged_admin', {users: docwithoutAdmin, len: docs.length});
            }, (error) => {
                console.log(error);
            });
        }
    });

    
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
        
            User.find().then((docs) => {
                console.log(docs.length);
                var docwithoutAdmin =[];
                for (var i=0; i<docs.length;i++)
                {
                    if(docs[i].username != "admin")
                    {
                        docwithoutAdmin.push(docs[i])
                    }
                }
                res.render('logged_admin', {users: docwithoutAdmin, len: docs.length});
            }, (error) => {
                console.log(error);
            });      
        
        
    }
    
      //console.log(req.body.firstname);

});

module.exports = router;