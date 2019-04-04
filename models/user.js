var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb://heroku_zlpdsrkk:v18bops13jcmokef4cpquls8v4@ds127646.mlab.com:27646/heroku_zlpdsrkk');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
    firstname: {
		type: String,
		index: true
	},
    lastname: {
		type: String,
		index: true
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
    phone: {
		type: String
	},
	email: {
		type: String
	},
	profileimage:{
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash;
   			newUser.save(callback);
    	});
	});
}