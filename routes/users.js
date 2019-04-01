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


/*router.get('/login', function(req, res, next) {
    
  res.render('login', {title:'Login'});
});*/


router.get('/logout', function(req, res, next) {
    
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
        console.log("DESTROTYYYYYYYYYYY")
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


function requiresLogin(req, res, next) {
  if (!req.user) {
    //console.log(req.user.username)
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}



router.get('/logged',  function(req, res, next) {
    
    if(!req.user || !req.session){
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
      console.log("Person is now logged")
      //console.log(req.body.firstname);
        User.find({username: req.user.username}, function(err, docs){
            console.log(docs)
            if (err) {console.log("user not found"); res.status(404).send();}
            else{
                res.render('logged',{user: {"firstname": docs[0].firstname.toString(), "lastname": docs[0].lastname.toString(), "username": docs[0].username.toString(), "email": docs[0].email.toString(),"phone": docs[0].phone.toString() }});
            }
        });
});

router.post('/logged', function(req, res, next) {
    console.log("USER LOGGED POST")
    //console.log(req.user);


    // User.findOneAndUpdate({
    //     _id: req.user.id
    // })
    User.findById(req.user.id).then((user1) => {
        console.log(req.body['First Name'])
        var newUser;
        if(req.body['password'] == '')
        {
            newUser = {
                firstname: req.body['First Name'],
                lastname: req.body['Last Name'],
                email: req.body['Email'],
                phone: req.body['Phone'],
                username: req.body['User Name'],
                password: user1.password
            }
            if (user1){
                user1.set(newUser);
                console.log(user1);
                user1.save().then((result) => {
                    console.log("UPDATED INFO check 3T");
                    res.render('logged',{user: {"firstname": user1.firstname.toString(), "lastname": user1.lastname.toString(), "username": user1.username.toString(), "email": user1.email.toString(),"phone": user1.phone.toString() }});
                }).catch((error)=>{
                    console.log("error in updating info");
                    res.status(400).send();
                });
                }
            else{console.log("error in updating info");}
        }
        else{
            bcrypt.hash(req.body['password'], 10, function(err, hash) {
                newUser = {
                    firstname: req.body['First Name'],
                    lastname: req.body['Last Name'],
                    email: req.body['Email'],
                    phone: req.body['Phone'],
                    username: req.body['User Name'],
                    password: hash
                }

                if (user1){
                user1.set(newUser);
                console.log(user1);
                user1.save().then((result) => {
                    console.log("UPDATED INFO check 3T");
                    res.render('logged',{user: {"firstname": user1.firstname.toString(), "lastname": user1.lastname.toString(), "username": user1.username.toString(), "email": user1.email.toString(),"phone": user1.phone.toString() }});
                }).catch((error)=>{
                    console.log("error in updating info");
                    res.status(400).send();
                });
                }
            else{console.log("error in updating info");}

            });
            
        }

        
        
    });
    
})


/*router.get('/login',function(req,res){
   res.render('login',{
     title  : 'Login',
     errors : req.flash('error')
   });
})*/


router.get('/login',function(req,res){
   res.render('login',{
     title  : 'Login',
     errors: req.flash('error')
   });
});



router.get('/register',function(req,res){
   res.render('register',{
     title : 'Register',
     errors: req.flash('error')
   });
});





router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('login', {
            errors: errors
        });
    }
    
    
    
    else if(req.body.username === 'admin'){
        return res.redirect('/admin/logged');
    }
    else{
        req.flash('success', 'You are now logged in');
        return res.redirect('/users/logged');
        
    }

    
})


passport.use("login", new LocalStrategy(function(username, password, done){
  User.findOne({username : username}, function(err, user){
    if(err){return done(err)}
    if(!user){
        return done(null, false, {messages : "no such user" })
    }
    if(user.password != password){
        return done(null, false, {messages : "invalid password"})
    }else{
        return done(null , user);
    }
  })
}))



/*router.post("/login", function(req, res, next){
    passport.authenticate("login", function(err, user, info){
        if(err){ return next(err);}
        if(!user){return res.render("login", {messages : info.messages})}
        req.logIn(user, function(err){
            if(err){ return next(err); }
            if(req.body.username === 'admin'){
                console.log("dddddddddddddd")
                return res.redirect('/admin/logged');
            }
            
            return res.redirect('/users/logged');
        })
    })(req, res, next)
})*/





passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register', upload.single('profileimage') ,function(req, res, next) {
    
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var phone = req.body.phone;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

    
  if(req.file){
  	console.log('Uploading File...');
  	var profileimage = req.file.filename;
  } else {
  	console.log('No File Uploaded...');
  	var profileimage = 'noimage.jpg';
  }
    
  if(username==='admin'){
    var err = new Error('You cant register as admin');
    err.status = 401;
    return next(err);
  }
    
  User.find({ 'username': username,'email': email }, function(err, user) {

        if (err) {

            console.log('Signup error');
            return next(err);
        }

        //if user found.
        if (user.length!=0) {
          if(user[0].username){
            req.flash('failure', 'Username already exists');
            console.log('Username already exists, username: ' + username);                         
             }else{
                req.flash('failure', 'email already exists');
                console.log('EMAIL already exists, email: ' + email);      
             }
             var err = new Error('Username already exists');
             err.status = 401;
             //return next(err);
             res.render('register', {
                errors: req.flash('failure')}
             );
            

        }
      
      else{
          
          
          
            // Form Validator
          req.checkBody('firstname','First Name field is required').notEmpty();
          req.checkBody('lastname','Last Name field is required').notEmpty();
          req.checkBody('email','Email is not valid').isEmail();
          req.checkBody('phone').isInt();
          req.checkBody('username','Username field is required').notEmpty();
          req.checkBody('password','Password field is required').notEmpty();
          req.checkBody('password2','Passwords do not match').equals(req.body.password);



          // Check Errors
          var errors = req.validationErrors();




          if(errors){
            res.render('register', {
                errors: errors
            });
          } else{
            var newUser = new User({
              firstname: firstname,
              lastname: lastname,
              phone: phone,
              email: email,
              username: username,
              password: password,
              profileimage: profileimage
            });

            User.createUser(newUser, function(err, user){
              if(err) throw err;
              console.log(user);
            });

            req.flash('success', 'You are now registered and can login');

            res.location('/users/login');
            res.redirect('/users/login');
            }
          
          
          
          
          
          
          
          
      }
   });

        
    

});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
