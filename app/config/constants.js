var allconstants = {};

function define (name, value) {

  Object.defineProperty(allconstants, name, {
      value: value
  });
}

if ( process.env.NODE_ENV === "development" ) {

  define("ENVIRONMENT", "development");

  define("DOMAIN", "http://localhost:3000");
  define("MONGOOSE_CONNECTION_STRING", "mongodb://127.0.0.1/diry-balance");

} else {

  define("ENVIRONMENT", "production");
}


define("SITE_NAME", "Dirty balance");


define("ROUTE_SUFFIXES", {
  "add": "add",
  "edit": "edit",
  "remove": "remove",
  "invite": "invite"
});

define("ROUTES", {
  "dashboard": "dashboard/",
  "user": "user/",
  "login": "login"
});



module.exports = allconstants;
