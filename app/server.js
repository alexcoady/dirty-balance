var app = require("./app");

app.listen( 3000, function ( error ) {

  if ( error ) {
    console.log("Unable to listen to connections");
    process.exit(10); // Internal JS error exit code
  }

  console.log("server started")
});
