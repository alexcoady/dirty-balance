var router = require("express").Router();
var bodyParser = require("body-parser")
var middleware = require("./../middleware/auth");

var C = require("./../config/constants");

module.exports = function ( passport ) {


  // Route handlers
  function home ( req, res ) {

    if ( req.user ) {

      return res.redirect( C.ROUTES.dashboard );
    }

    res.render( "site/home", {
      loginMessage: req.flash("loginMessage"),
      signupMessage: req.flash("signupMessage")
    });
  }

  function dashboard ( req, res ) {

    res.render( "site/dashboard" );
  }

  function logout ( req, res ) {

    req.logout();
    res.redirect("/");
  }


  // Route definitions
  router.get( "/", home );
  router.get( "/dashboard", middleware.isLoggedIn, dashboard );
  router.get( "/logout", logout );

  // ---------------------------------------------------------------------------
  // ----- AUTHENTICATING - User signing up or logging in ----------------------
  // ---------------------------------------------------------------------------


  // LOCAL
  router.post( "/login", bodyParser.json(), bodyParser.urlencoded({extended:true}), passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true
  }));

  // FACEBOOK
  router.get( "/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }) );
  router.get( "/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }));

  // TWITTER
  router.get( "/auth/twitter", passport.authenticate("twitter", { scope: "email" }) );
  router.get( "/auth/twitter/callback", passport.authenticate("twitter", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }));

  // GOOGLE
  router.get( "/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }) );
  router.get( "/auth/google/callback", passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }));

  // ---------------------------------------------------------------------------
  // ----- AUTHORISING - Connecting accounts together --------------------------
  // ---------------------------------------------------------------------------

  function connectLocal ( req, res ) {

    res.render("connectLocal", {
      signupMessage: req.flash("signupMessage")
    });
  }

  // LOCAL (still uses .authenticate() method)
  router.get( "/connect/local", connectLocal );
  router.post( "/connect/local", bodyParser.json(), bodyParser.urlencoded({extended:true}), passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/connect/local",
    failureFlash: true
  }));

  // FACEBOOK
  router.get( "/connect/facebook", passport.authorize("facebook", { scope: ["email"] }) );

  // TWITTER
  router.get( "/connect/twitter", passport.authorize("twitter", { scope: ["email"] }) );

  // GOOGLE
  router.get( "/connect/google", passport.authorize("google", { scope: ["profile", "email"] }) );


































  // ---------------------------------------------------------------------------
  // ----- UNLINKING - Removing an account -------------------------------------
  // ---------------------------------------------------------------------------

  // LOCAL (still uses .authenticate() method)
  router.get( "/unlink/local", function ( req, res ) {

    var user = req.user;

    user.local.email = undefined;
    user.local.password = undefined;

    user.save(function ( err ) {
      if ( err ) throw err;
      res.redirect("/profile");
    });
  });

  // FACEBOOK
  router.get( "/unlink/facebook", function ( req, res ) {

    var user = req.user;

    user.facebook.token = undefined;

    user.save(function ( err ) {
      if ( err ) throw err;
      res.redirect("/profile");
    });
  });

  // TWITTER
  router.get( "/unlink/twitter", function ( req, res ) {

    var user = req.user;

    user.twitter.token = undefined;

    user.save(function ( err ) {
      if ( err ) throw err;
      res.redirect("/profile");
    });
  });

  // GOOGLE
  router.get( "/unlink/google", function ( req, res ) {

    var user = req.user;

    user.google.token = undefined;

    user.save(function ( err ) {
      if ( err ) throw err;
      res.redirect("/profile");
    });
  });

  return router;
};
