// Dependencies
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var AUTH = require("./auth");
var User = require("./../users/userModel").Model;

module.exports = function ( passport ) {

  /**
   *  Takes user document (from database, not facebook) and chooses
   *  a property to store as an identifier. (user._id) in this case.
   *
   *  @method passport.serializeUser
   *  @param {Object} user The user document from the database
   *  @param {Function} done The next step function
   */
  passport.serializeUser(function ( user, done ) {

    done(null, user._id);
  });


  /**
   *  Takes a user identifier and locates their record
   *
   *  @method passport.deserializeUser
   *  @param {String} userId Unique database identifier for a user
   *  @param {Function} done The next step function
   */
  passport.deserializeUser(function ( userId, done ) {

    User.findById( userId, function ( err, foundUser ) {

      if (!foundUser) return done();
      // ---------------------------

      done( err, foundUser );
    });
  });



  passport.use("local", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  function ( req, email, password, done ) {

    process.nextTick(function () {

      User.findOne({ "local.email": email }, function ( err, foundUser ) {

        if ( err ) return done( err );

        // Different action handlers
        if ( req.body.authtype === "signup" || req.body.authtype === "connect" ) {

          if ( foundUser )
            return done( null, false, req.flash("signupMessage", "Email address already registered") );

          // Create or connect user
          var user = req.user ? req.user : new User();

          user.local.email = email;
          user.local.password = User.generateHash( password );

          user.save(function ( err ) {

            if ( err ) throw err;

            return done( null, user );
          });

        } else if ( req.body.authtype === "login" ) {

          if ( !foundUser )
            return done( null, false, req.flash("loginMessage", "No user found with that email address") );

          if ( !foundUser.validPassword(password) )
            return done( null, false, req.flash("loginMessage", "Password is incorrect") );

          // Successfully logged in
          return done( null, foundUser );
        }
      });

    });
  }));

  passport.use(new FacebookStrategy({
    clientID: AUTH.FACEBOOK.clientID,
    clientSecret: AUTH.FACEBOOK.clientSecret,
    callbackURL: AUTH.FACEBOOK.callbackURL,
    passReqToCallback: true
  }, authCallback));


  passport.use(new TwitterStrategy({
    consumerKey: AUTH.TWITTER.consumerKey,
    consumerSecret: AUTH.TWITTER.consumerSecret,
    callbackURL: AUTH.TWITTER.callbackURL,
    passReqToCallback: true
  }, authCallback));


  passport.use(new GoogleStrategy({
    clientID: AUTH.GOOGLE.clientID,
    clientSecret: AUTH.GOOGLE.clientSecret,
    callbackURL: AUTH.GOOGLE.callbackURL,
    passReqToCallback: true
  }, authCallback));


  function authCallback ( req, token, refreshToken, profile, done ) {

    var provider = profile.provider;
    var options = {};

    process.nextTick(function () {

      if ( provider === "facebook" ) options["facebook.id"] = profile.id;
      else if ( provider === "twitter" ) options["twitter.id"] = profile.id;
      else if ( provider === "google" ) options["google.id"] = profile.id;

      if ( !req.user ) {

        // CREATE USER OR LOG-IN
        User.findOne( options, function ( err, user ) {

          if ( err ) return done( err );

          if ( user ) {

            if ( !user[provider].token ) {

              if ( provider === "facebook" ) {

                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                user.name = profile.name.givenName + " " + profile.name.familyName;

              } else if ( provider === "twitter" ) {

                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                user.name = profile.displayName;

              } else if ( provider === "google" ) {

                user.google.token = token;
                user.google.email = profile.emails[0].value;
                user.google.name = profile.displayName;

                user.name = profile.displayName;
              }

              user.save(function ( err ) {

                if ( err ) throw err;
                return done( null, user );
              });

            } else {

              return done( null, user );
            }
          }

          var newUser = new User();

          if ( provider === "facebook" ) {

            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.name = profile.name.givenName + " " + profile.name.familyName;

          } else if ( provider === "twitter" ) {

            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;

            newUser.name = profile.displayName;

          } else if ( provider === "google" ) {

            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.email = profile.emails[0].value;
            newUser.google.name = profile.displayName;

            newUser.name = profile.displayName;
          }

          newUser.save(function ( err ) {

            if ( err ) throw err;

            return done( null, newUser );
          });

        });

      } else {

        // CONNECT CURRENT USER
        var user = req.user;

        if ( provider === "facebook" ) {

          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + " " + profile.name.familyName;
          user.facebook.email = profile.emails[0].value;

          user.name = profile.name.givenName + " " + profile.name.familyName;

        } else if ( provider === "twitter" ) {

          user.twitter.id = profile.id;
          user.twitter.token = token;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;

          user.displayName = profile.displayName;

        } else if ( provider === "google" ) {

          user.google.id = profile.id;
          user.google.token = token;
          user.google.email = profile.emails[0].value;
          user.google.name = profile.displayName;

          user.name = profile.displayName;
        }

        user.save(function ( err ) {

          if ( err ) throw err;
          return done( null, user );
        });
      }

    });
  }
};
