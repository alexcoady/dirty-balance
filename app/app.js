var express = require("express");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var cookieParser = require("cookie-parser");
var passport = require("passport");
var flash = require("connect-flash");
var DateUtils = require("date-utils");

var app = express();

require("./database"); // TODO: Move somewhere nicer?
require("./config/passport")(passport);

// Settings
app.set( "views", __dirname );
app.set( "view engine", "jade" );

// Global variables
app.locals.C = require("./config/constants");
app.locals.dateformat = require("dateformat");

// Session settings
app.use( cookieParser() );

if ( process.env.NODE_ENV == 'development' ) {

  app.use( session({

    secret: 'keyboard cat',
    store: new MongoStore({
      db : 'session'
    }),
    resave: false,
    saveUninitialized: false
  }));

} else app.use( session({ secret: 'keyboard cat' }) );

// Passport settings
app.use( passport.initialize() );
app.use( passport.session() );

app.use( flash() );

// Static files
app.use( "/public", express.static(__dirname + "./../public/") );

// Routers
app.use( require("./site/router")(passport) );
app.use( require("./users/router") );

// Errors
app.use( require("./errors/notFound") );

module.exports = app;
