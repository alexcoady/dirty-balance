var mongoose = require("mongoose");
var _ = require("underscore");

var IteratorYearly = require("./iterators/iterator-yearly");
var IteratorMonthly = require("./iterators/iterator-monthly");
var IteratorWeekly = require("./iterators/iterator-weekly");
var IteratorDaily = require("./iterators/iterator-daily");

var WeekdaySchema = new mongoose.Schema({
  day: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  },
  n: Number
});


WeekdaySchema.methods.toJSDateDay = function () {
  return this.day === 6 ? 0 : this.day + 1;
};


var BillSchema = new mongoose.Schema({
  amount: Number,
  vendor: String,
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rrule: {
    freq: Number,
    interval: Number,
    dtstart: Date,
    count: Number,
    until: Date,
    bymonthday: [Number],
    byweekday: [WeekdaySchema],
    byyearday: [Number]
  }
});

BillSchema.statics.OPTION_NAMES = [
  "freq",
  "dtstart",
  "interval",
  "wkst",
  "count",
  "until",
  "bysetpos",
  "bymonthday",
  "byweekday",
  "byyearday"
];

BillSchema.statics.FREQUENCIES = [
  "YEARLY",
  "MONTHLY",
  "WEEKLY",
  "DAILY"
];

BillSchema.statics.SU = { day: 0 };
BillSchema.statics.MO = { day: 1 };
BillSchema.statics.TU = { day: 2 };
BillSchema.statics.WE = { day: 3 };
BillSchema.statics.TH = { day: 4 };
BillSchema.statics.FR = { day: 5 };
BillSchema.statics.SA = { day: 6 };

BillSchema.statics.JAN = 0;
BillSchema.statics.FEB = 1;
BillSchema.statics.MAR = 2;
BillSchema.statics.APR = 3;
BillSchema.statics.MAY = 4;
BillSchema.statics.JUN = 5;
BillSchema.statics.JUL = 6;
BillSchema.statics.AUG = 7;
BillSchema.statics.SEP = 8;
BillSchema.statics.OCT = 9;
BillSchema.statics.NOV = 10;
BillSchema.statics.DEC = 11;

BillSchema.statics.YEARLY = 0;
BillSchema.statics.MONTHLY = 1;
BillSchema.statics.WEEKLY = 2;
BillSchema.statics.DAILY = 3;

BillSchema.statics.DEFAULT_LIST_OPTIONS = {
  after: undefined,
  before: undefined,
  include: true,
  loopKill: 500,
  sort: false,
  iterator: function ( date, i ) {
    return i < 25;
  },
  predicate: function ( date, i ) {
    return true;
  }
};



/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
BillSchema.methods.addFactory = function ( options, dates ) {

  var rrule = this.rrule;

  var predicate = options.predicate;
  var iterator = options.iterator;

  var maxDate = options.maxDate;
  var minDate = options.minDate;

  options.add = function ( date ) {

    // Break if enough dates have been added
    if ( dates.length >= rrule.count ) return false;

    // Break if out of date bounds
    if ( minDate && date.isBefore(minDate) ) return true;
    if ( maxDate && date.isAfter(maxDate) ) return false;

    // Test against iterator and predicate
    if ( !iterator( date, dates.length ) ) return false;
    if ( predicate( date, dates.length ) ) return dates.push( new Date(date.getTime()) );

    return true;
  };

  return options;
};

/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
BillSchema.methods.calcMinDate = function ( options ) {

  if ( options.after ) {

    options.minDate = new Date(Date.compare(options.after, this.rrule.dtstart) === -1 ? this.rrule.dtstart : options.after );

  } else {

    options.minDate = this.rrule.dtstart;
  }

  return options;
};


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
BillSchema.methods.calcMaxDate = function ( options ) {

  if ( options.before && this.rrule.until ) {

    options.maxDate = new Date(Date.compare(options.before, this.rrule.until) === -1 ? options.before : this.rrule.until);

  } else if ( options.before ) {

    options.maxDate = new Date( options.before );

  } else if ( this.rrule.until ) {

    options.maxDate = new Date(  this.rrule.until );
  }

  return options;
};


/**
 *
 *  @param {Object} options
 *  @return {[Date]} Array of recurring dates
 */
 BillSchema.methods.calcStartDate = function ( options ) {

  if ( !options.after ) {
    options.after = new Date( this.rrule.dtstart.getTime() );
  }

  return options;
}


/**
 *
 *  @param {Object} options
 *  @return {Object} options
 */
BillSchema.methods.list = function ( options ) {

  var options = _.extend( {}, BillModel.DEFAULT_LIST_OPTIONS, options );
  var pointer;
  var dates = [];
  var count = -1;

  this.calcMinDate( options );
  this.calcMaxDate( options );
  this.calcStartDate( options );
  this.addFactory( options, dates );

  pointer = new Date( options.after );

  // MASTER LOOP
  masterloop: while ( count++ < options.loopKill ) {

    // YEARLY LOOP
    if ( this.rrule.freq === BillModel.YEARLY ) {

      if ( !IteratorYearly.list(this.rrule, options, new Date(pointer)) ) break masterloop;
    }

    // MONTHLY LOOP
    else if ( this.rrule.freq === BillModel.MONTHLY ) {

      if ( !IteratorMonthly.list(this.rrule, options, new Date(pointer)) ) break masterloop;
    }

    // WEEKLY LOOP
    else if ( this.rrule.freq === BillModel.WEEKLY ) {

      if ( !IteratorWeekly.list(this.rrule, options, new Date(pointer)) ) break masterloop;
    }

    // DAILY LOOP
    else if ( this.rrule.freq === BillModel.DAILY ) {

      if ( !IteratorDaily.list(this.rrule, options, new Date(pointer)) ) break masterloop;
    }

    // Update iterator
    if ( this.rrule.freq === BillModel.YEARLY ) {
      pointer.setFullYear( pointer.getFullYear() + this.rrule.interval );
    } else if ( this.rrule.freq === BillModel.MONTHLY ) {
      pointer.setMonth( pointer.getMonth() + this.rrule.interval );
    } else if ( this.rrule.freq === BillModel.WEEKLY ) {
      pointer.setDate( pointer.getDate() + ( this.rrule.interval * 7 ) );
    } else if ( this.rrule.freq === BillModel.DAILY ) {
      pointer.setDate( pointer.getDate() + this.rrule.interval );
    }
  }

  console.log("Looped %s times; generated %s dates", count, dates.length);

  if ( !options.sort ) return dates;

  return dates.sort(function (a, b) {
    return a.getTime() - b.getTime();
  });
}

var BillModel = mongoose.model( "Bill", BillSchema );


module.exports = {
  Model: BillModel,
  Schema: BillSchema
};
