// Dependencies
var router = require("express").Router();
var bodyParser = require("body-parser");
var validator = require("validator");
var _ = require("underscore");
var dateformat = require("dateformat");

// App dependencies
var Bill = require("./../bills/billModel").Model;


// Parameter sniffing
function billId ( req, res, next, billId ) {

  Bill.findOne({
    _id: billId
  })
  .populate( "owner", "name" )
  .exec(function ( err, foundBill ) {

    if ( err ) return next( err );

    if ( !foundBill ) return res.send(404, "Bill not found");

    console.log("> Params: billId (%s, %s, %s)", foundBill.amount, foundBill.name, foundBill.vendor);
    req.bill = foundBill;
    next();
  });
};


function paymentTimestamp ( req, res, next, paymentTimestamp ) {

  var paymentDate = new Date( +paymentTimestamp );

  if ( !req.bill ) return res.send(404, "Bill not found");
  if ( isNaN( paymentDate.getTime() ) ) return res.send( 500, "Invalid date" );

  var list = req.bill.list({
    after: new Date(paymentDate),
    before: new Date(paymentDate)
  });

  if ( list.length === 0 ) return res.send(404, "Payment not found");

  console.log("> Params: paymentTimestamp (%s)", dateformat(paymentDate, "mediumDate"));
  req.paymentDate = paymentDate;
  next();
};


module.exports = {
  billId: billId,
  paymentTimestamp: paymentTimestamp
};
