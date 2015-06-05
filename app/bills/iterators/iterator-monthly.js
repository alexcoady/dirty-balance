function IteratorMonthly () {}


/**
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
 IteratorMonthly.list = function ( rrule, options, pointer ) {

   // Breaks
   if ( rrule.bymonthday.length ) {

     return IteratorMonthly.bymonthdayList( rrule, options, pointer );

   }
  //  else if ( rrule.bysetpos.length && rrule.byweekday.length ) {
   //
  //    return IteratorMonthly.bysetposList( rrule, options, pointer );
   //
  //  }
   else if ( rrule.byweekday.length ) {

     return IteratorMonthly.byweekdayList( rrule, options, pointer );
   }

   return false;
};


/**
 *  The simpliest of the monthly iterators; this one has certain days
 *  in the month specified [1-31] and adds them in the given month
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
IteratorMonthly.bymonthdayList = function ( rrule, options, pointer ) {

  var i = 0;
  var monthdaysCount = rrule.bymonthday.length;
  var monthPointer;

  // Go to last date of the previous month
  pointer.setDate( 0 );

  for ( i; i < monthdaysCount; i += 1 ) {

    // Reset to pointer
    monthPointer = new Date( pointer );

    // Set correct date
    monthPointer.setDate( rrule.bymonthday[i] );

    // Month may have jumped to next month
    // e.g. if date is 31 in a month with 28 days
    if ( monthPointer.getMonth() !== pointer.getMonth() ) continue;

    // Add
    if ( !options.add( monthPointer ) ) return false;
  }

  // Keep loop going
  return true;
};


IteratorMonthly.bysetposList = function ( rrule, options, pointer ) {

  console.log("> IteratorMonthly: bysetposList");

  // Generate dates for each day specified then return the nth occurance


  // Kill loop
  return false;
};


/**
 *  The most complicated of the monthly iterators; this one has a number
 *  of weekdays specified with n-values that represent the occurance of that
 *  day within the month (i.e. first monday, last friday, 3rd tuesday)
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
IteratorMonthly.byweekdayList = function ( rrule, options, pointer ) {

  console.log("> IteratorMonthly: byweekdayList");

  var i = 0;
  var byweekdayCount = rrule.byweekday.length;
  var dayPointer;

  var pointerDay;
  var weekday;
  var weekdayJSDay;
  var diff;

  options.sort = true;

  for ( i; i < byweekdayCount; i += 1 ) {

    // Set pointer to 1st of month
    dayPointer = new Date( pointer.getTime() );

    // Shorthands
    weekday = rrule.byweekday[i];
    weekdayJSDay = weekday.toJSDateDay();

    if ( weekday.n > 0 ) {

      pointerDay = dayPointer.getDay();

      // Calculate days to add to find first of day in month
      diff = pointerDay <= weekdayJSDay ? weekdayJSDay - pointerDay : 7 - pointerDay + weekdayJSDay;
      dayPointer.setDate( dayPointer.getDate() + diff );

      dayPointer.setDate( dayPointer.getDate() + ( 7 * weekday.n ) - 7 );

      // Check date is still within the correct month
      if ( dayPointer.getMonth() !== pointer.getMonth() ) continue;
      if ( !options.add( dayPointer ) ) return false;

    } else if ( weekday.n === -1 ) {

      // Go to last day in the month
      dayPointer.setMonth( dayPointer.getMonth() + 1, 0 );
      pointerDay = dayPointer.getDay();

      // Go to correct day in month
      diff = weekdayJSDay < pointerDay ? weekdayJSDay - pointerDay : ( weekdayJSDay - pointerDay - 7 );
      diff = diff <= -7 ? diff + 7 : diff;

      dayPointer.setDate( dayPointer.getDate() + diff );

      if ( !options.add( dayPointer ) ) return false;
    }
  }

  // Kill loop
  return true;
};


module.exports = IteratorMonthly;
