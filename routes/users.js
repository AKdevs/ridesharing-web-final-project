var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload  = multer({dest:'./uploads/'});

const { User } = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

router.get('/logged', function(req, res, next) {
  res.sendfile('./public/logged.html');
});



router.get('/login', function(req, res, next) {
    res.sendfile('./public/login.html', {title: 'Login'});
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
    //var profileimage = req.file.fileName;
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
        phone: phone
        //profileimage: profileimage
    });
    
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
