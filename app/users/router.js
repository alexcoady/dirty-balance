var router = require("express").Router();
var middleware = require("./../middleware/auth");


function profile ( req, res ) {
  
  res.render("users/profile", {
    user: req.user
  });
}


router.use( "/profile", middleware.isLoggedIn );
router.get( "/profile", profile );
router.get( "/users/:username", profile );

module.exports = router;
