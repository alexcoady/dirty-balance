// Dependencies
var router = require("express").Router();
var bodyParser = require("body-parser");
var validator = require("validator");
var _ = require("underscore");

// App dependencies
var middleware = require("./../middleware/auth");
var params = require("./../middleware/params");

function paymentView ( req, res ) {

  res.render("payments/view", {
    bill: req.bill,
    paymentDate: req.paymentDate
  });
}


function paymentUpdateView ( req, res ) {

  res.render("payments/update", {
    bill: req.bill,
    paymentDate: req.paymentDate
  });
}


// Middleware
router.use( middleware.isLoggedIn );

// Params
router.param( "billId", params.billId );
router.param( "paymentTimestamp", params.paymentTimestamp );

// GET
router.get( "/bills/:billId/payments/:paymentTimestamp", paymentView )
router.get( "/bills/:billId/payments/:paymentTimestamp/edit", paymentUpdateView )

// POST
// ...

module.exports = router;
