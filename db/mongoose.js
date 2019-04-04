'use strict';

const mongoose = require('mongoose');

const uri = "mongodb+srv://atharva2k:marg2010@ridestest-98tsm.mongodb.net/test?retryWrites=true";
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/RestaurantAPI', { useNewUrlParser: true, useCreateIndex: true});
mongoose.connect(uri, { dbName: "RidesTest", useNewUrlParser: true })
  .then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));

module.exports = {
	mongoose
}