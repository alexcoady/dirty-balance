// Dependencies
var router = require("express").Router();
var bodyParser = require("body-parser");
var validator = require("validator");
var _ = require("underscore");

// App dependencies
var middleware = require("./../middleware/auth");
var params = require("./../middleware/params");
var Bill = require("./billModel").Model;

function billsView ( req, res ) {

  Bill.find({
    owner: req.user
  })
  .exec(function ( err, bills ) {

    if ( err ) return res.send( 500, err );

    res.render("bills/all", {
      bills: bills
    });
  });
}

function billView ( req, res ) {

  var dates = req.bill.list();

  res.render("bills/view", {
    bill: req.bill,
    dates: dates
  });
}

function billUpdateView ( req, res ) {

  res.render("bills/update", {
    bill: req.bill
  });
}

function billAddView ( req, res ) {

  res.render("bills/add");
}


/**
 *  Adds [or updates] a bill
 *
 *  @function billHandler
 */
function billHandler ( req, res, next ) {

  var bill = req.bill || new Bill();
  var form = req.body;
  var rrule = form.rrule;

  // AMOUNT
  if ( validator.isFloat( form.amount ) ) {
    bill.amount = validator.toFloat( form.amount );
  }

  // VENDOR
  if ( form.vendor ) {
    bill.vendor = validator.toString( form.vendor );
  }

  // NAME
  if ( form.name ) {
    bill.name = validator.toString( form.name );
  }

  // OWNER
  bill.owner = req.user;

  // RRULE FREQ
  if ( validator.isInt( rrule.freq ) ) {
    bill.rrule.freq = validator.toInt( rrule.freq );
  }

  // RRULE INTERVAL
  if ( validator.isInt( rrule.interval ) ) {
    bill.rrule.interval = validator.toInt( rrule.interval );
  } else {
    bill.rrule.interval = 1;
  }

  // RRULE DTSTART
  if ( validator.isDate( rrule.dtstart ) ) {
    bill.rrule.dtstart = validator.toDate( rrule.dtstart );
  } else {
    bill.rrule.dtstart = null;
  }

  // RRULE COUNT
  if ( validator.isInt( rrule.count ) ) {
    bill.rrule.count = validator.toInt( rrule.count );
  } else {
    bill.rrule.count = undefined;
  }

  // RRULE UNTIL
  if ( validator.isDate( rrule.until ) ) {
    bill.rrule.until = validator.toDate( rrule.until );
  } else {
    bill.rrule.until = undefined;
  }

  // RRULE BY MONTH DAY
  if ( rrule.bymonthday ) {

    bill.rrule.bymonthday = _.map( rrule.bymonthday, function ( string ) {
      var int = validator.toInt( string );
      return int !== NaN ? int : null;
    });

    bill.rrule.bymonthday = bill.rrule.bymonthday.filter(Number);

  } else {

    bill.rrule.bymonthday = [];
  }

  // RRULE BY WEEK DAY
  if ( bill.rrule.freq === Bill.MONTHLY && rrule.byweekdayOffset && rrule.byweekdayDay ) {

    if ( validator.isInt( rrule.byweekdayOffset ) && validator.isInt( rrule.byweekdayDay ) ) {

      bill.rrule.byweekday = [{
        day: validator.toInt( rrule.byweekdayDay ),
        n: validator.toInt( rrule.byweekdayOffset )
      }];
    }
  } else if ( bill.rrule.freq === Bill.WEEKLY && rrule.byweekday ) {

    bill.rrule.byweekday = _.map(rrule.byweekday, function ( string ) {

      return {
        day: validator.toInt( string )
      };
    });
  } else {

    bill.rrule.byweekday = [];
  }

  // RRULE BY YEAR DAY
  if ( rrule.byyearday ) {

    bill.rrule.byyearday = rrule.byyearday.split(",");
    bill.rrule.byyearday = _.map(bill.rrule.byyearday, function ( string ) {

      if ( validator.isInt( string ) ) {

        return validator.toInt( string ) || null;
      }
    });
    bill.rrule.byyearday = _.filter(bill.rrule.byyearday, function ( num ) {

      if ( num > 0 && num <= 365 ) return true;
      return false;
    });

  } else {

    bill.rrule.byyearday = [];
  }


  // Save bill
  bill.save(function ( err, savedBill ) {

    if ( err ) return next( err );

    res.redirect( "/bills/" + savedBill._id );
  });
}

// Middleware
router.use( middleware.isLoggedIn );

// Params
router.param( "billId", params.billId );

// GET
router.get( "/bills", billsView );
router.get( "/bills/add", billAddView );
router.get( "/bills/:billId", billView );
router.get( "/bills/:billId/edit", billUpdateView );

// POST
router.post( "/bills", bodyParser(), billHandler );
router.post( "/bills/:billId", bodyParser(), billHandler );


module.exports = router;
