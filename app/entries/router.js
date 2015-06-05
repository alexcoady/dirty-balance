var router = require("express").Router();
var middleware = require("./../middleware/auth");


function all ( req, res ) {

  res.render("entries/all", {
    user: req.user
  });
}


router.get( "/entries", all );

module.exports = router;
