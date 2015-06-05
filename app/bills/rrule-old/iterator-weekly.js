function IteratorWeekly () {}


/**
 *  This loop generates dates for a weekly recurrance rule.
 *  It accepts a rule, some options and a pointer that represents
 *  the current progress by the master loop.
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
 IteratorWeekly.list = function ( rrule, options, pointer ) {

  var i = 0;
  var byweekdayCount = rrule.byweekday.length;
  var weekPointer;

  // Breaks
  if ( !rrule.byweekday.length ) return false;

  // Update pointer to start of week
  pointer.setDate( pointer.getDate() - pointer.getDay() );

  // Loop through days of week and see if appropriate
  for ( i; i < byweekdayCount; i += 1 ) {

    // Get mutable date based on pointer
    weekPointer = new Date( pointer.getTime() );

    // Set pointer day to this day
    weekPointer.setDate( weekPointer.getDate() + rrule.byweekday[i].toJSDateDay() );

    // Add
    if ( !options.add( weekPointer ) ) return false;
  }

  return true;
};


module.exports = IteratorWeekly;
