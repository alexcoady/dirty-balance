var mongoose = require("mongoose");
var C = require("./config/constants");

// Conect to database
mongoose.connect( C.MONGOOSE_CONNECTION_STRING );
mongoose.connection.once( "open", function callback () {
  console.info( "Database: Connected" );
});
