var authconstants = {};

function define (name, value) {

  Object.defineProperty(authconstants, name, {
      value: value
  });
}

var facebook = {
  callbackURL: "/auth/facebook/callback"
};

var twitter = {
  consumerKey: "yZZcJroxXrm6ENK9VZJnT7LAf",
  consumerSecret: "qkHndibHrhTylIBpVv51IbxMB1s8WMlyMaPhxdmVRqvLARZumj",
  callbackURL: "/auth/twitter/callback"
};

var google = {
  clientID: "326770642454-0vkubb3d9h049k6rv184vela7fr3eckr.apps.googleusercontent.com",
  clientSecret: "A-Aouki-rknHGW9BwAK_HUEC",
  callbackURL: "/auth/google/callback"
};

if ( process.env.NODE_ENV === "development" ) {

  facebook.clientID = "1422226411371060";
  facebook.clientSecret = "3a432fe95d9583e07cd57d3649512d77";

  google.callbackURL = "http://localhost:3000" + google.callbackURL;
  facebook.callbackURL = "http://localhost:3000" + facebook.callbackURL;

} else {

  facebook.clientID = "1422208381372863";
  facebook.clientSecret = "e3083d7d38e945a9462897c1b0d085ec";

  google.callbackURL = "http://split-app.co" + google.callbackURL;
}

define("FACEBOOK", facebook);
define("TWITTER", twitter);
define("GOOGLE", google);


module.exports = authconstants;
