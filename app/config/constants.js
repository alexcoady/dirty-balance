var allconstants = {};

function define (name, value) {

  Object.defineProperty(allconstants, name, {
      value: value
  });
}

if ( process.env.NODE_ENV === "development" ) {

  define("ENVIRONMENT", "development");

  define("DOMAIN", "http://localhost:3000");
  define("MONGOOSE_CONNECTION_STRING", "mongodb://127.0.0.1/split-2-0");

} else {

  define("ENVIRONMENT", "production");

  define("DOMAIN", "http://split-app.co");
  // define("MONGOOSE_CONNECTION_STRING", "mongodb://nodejitsu_alexcoady:sep0diaovm8nh874ggdd7b3d26@ds047008.mongolab.com:47008/nodejitsu_alexcoady_nodejitsudb7367193060");
}


define("ROUTES", {
  "dashboard": "dashboard/",
  "splits": "splits/",
  "bills": "bills/",
  "transfers": "transfers/",
  "payments": "payments/",
  "members": "members/",
  "invitations": "invitations/",
  "user": "user/",
  "login": "login"
});


define("ROUTE_SUFFIXES", {
  "add": "add",
  "edit": "edit",
  "remove": "remove",
  "invite": "invite"
});


define("NTH_OCCURANCES", [
  { "title": "1st", "value": 1 },
  { "title": "2nd", "value": 2 },
  { "title": "3rd", "value": 3 },
  { "title": "4th", "value": 4 },
  { "title": "5th", "value": 5 },
  { "title": "Last", "value": -1 }
]);

define("WEEKDAYS", [
  { "title": "Sunday", "short": "Sun", "value": 0 },
  { "title": "Monday", "short": "Mon", "value": 1 },
  { "title": "Tuesday", "short": "Tue", "value": 2 },
  { "title": "Wednesday", "short": "Wed","value": 3 },
  { "title": "Thursday", "short": "Thu","value": 4 },
  { "title": "Friday", "short": "Fri", "value": 5 },
  { "title": "Saturday", "short": "Sat", "value": 6 }
]);

module.exports = allconstants;
