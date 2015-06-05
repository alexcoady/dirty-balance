module.exports = {

  isLoggedIn: function ( req, res, next ) {

    if ( req.isAuthenticated() ) {

      res.locals.activeUser = req.user;
      return next();
    }


    res.redirect("/");
  }
};
