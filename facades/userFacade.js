var mongoose = require("mongoose");
var User = require("../models/User");

function getAllUsers() {
  return User.find({}).exec();
}


function findByUsername(userName) {
  return User.findOne({ userName }).exec();
}

function findById(id) {
  return User.findById({ _id: id }).exec();
}

async function addUser(firstName, lastName, userName, password, email) {
  var user = new User({ firstName: firstName, lastName: lastName, userName: userName,  password: password,  email: email  });
  await user.save();
  return user;
}
module.exports = {
  getAllUsers,
  addUser,
  findByUsername,
  findById
}