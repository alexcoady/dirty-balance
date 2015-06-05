var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema({
  name: String,
  timeline: {
    added: {
      date: {
        type: Date,
        default: Date.now
      }
    },
    updated: Date,
    removed: Date
  },
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

UserSchema.static("generateHash", function ( password ) {

  return bcrypt.hashSync( password, bcrypt.genSaltSync(8), null );
});

UserSchema.method("validPassword", function ( password ) {

  return bcrypt.compareSync( password, this.local.password );
});


var UserModel = mongoose.model( "User", UserSchema );

module.exports = {
  Model: UserModel,
  Schema: UserSchema
};
