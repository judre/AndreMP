var mongoose = require('mongoose');
var debug = require("debug")('minidemo:mongo');

function connect(connectionString) {
  return mongoose.connect(connectionString,{useNewUrlParser: true,useCreateIndex: true });
}
mongoose.connection.on('connected', function () {
 debug('Mongoose default connection open ' );
});
mongoose.connection.on('disconnected', function () {
 debug('Mongoose connection closed ' );
});
mongoose.connection.on('error', function (err) {
 debug('Mongoose default connection error: ' + err);
});

module.exports = connect;
