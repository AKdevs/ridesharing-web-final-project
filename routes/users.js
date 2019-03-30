var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload  = multer({dest:'./uploads/'});
const bcrypt = require('bcrypt');


const { User } = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

router.get('/logged', function(req, res, next) {
    console.log("trying to login now...");
    var user = User.find();
    console.log(user);
    // bcrypt.compare(req.body.password, user.hash, function(err, res) {
    //     if(res) {
    //     // Passwords match
    //     } else {
    //     // Passwords don't match
    //     } 
    // });    
  res.sendfile('./public/logged.html');
});



router.get('/login', function(req, res, next) {

    // var user = User.getUser(req.body.username);
    // console.log(user);
    // bcrypt.compare(req.body.password, user.hash, function(err, res) {
    //     if(res) {
    //     // Passwords match
    //     } else {
    //     // Passwords don't match
    //     } 
    // });    

    res.sendfile('./public/login.html', {title: 'Login'});
});

router.post('/login', function(req, res, next) {
    console.log("POST /user");
    var allowed = false;
    User.find({username: req.body.username}, function(err, docs){
        if (err) {console.log("user not found"); res.status(404).send();}
        dbHash = docs[0].hash;

        bcrypt.compare(req.body.password, docs[0].hash, function(err, result) {
            if(result) {
                console.log("Welcome "+ docs[0].firstname)
                allowed=true;
                res.location('/users/logged');
                res.redirect('/users/logged');
            } else {
                console.log("user unauthorized");
                allowed=false;
                res.status(401).send();
            } 
        }); 

    });

    // console.log("allowed: "+ allowed);
    // if(allowed){
    //     res.location('/users/logged');
    //     res.redirect('/users/logged');
    // }
    // else{
    //     res.status(401).send();
    // }
}); 


router.get('/register', function(req, res, next) {
    res.sendfile('./public/registration.html', {title: 'Register'});
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
    
    console.log("Reach herreeeee");
    //console.log(req.file);
    
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.psw;
    var password_repeat = req.body.psw_repeat;

    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in database
       
        console.log("PRINTING HASH _________________________________________");
        console.log(hash);

        console.log(firstname);
        console.log(email);
        console.log(password);
        console.log(password_repeat);
        //console.log(req.file);
        var newUser = new User({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            phone: phone,
            hash: hash
            //profileimage: profileimage
        });
        
       
    })
    //var profileimage = req.file.fileName;
    
     newUser.save().then((result) => {
            res.send(result);
        }, (error) => {
            res.status(400).send(error);
        });
    
    
    //console.log(newUser);
   // User.createUser(newUser, function(){
   //     console.log(user);
   // });
    
    res.location('/users/logged');
    res.redirect('/users/logged');

});


module.exports = router;
