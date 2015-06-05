function IteratorYearly () {}


/**
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
 IteratorYearly.list = function ( rrule, options, pointer ) {

   var i = 0;
   var yeardaysCount = rrule.byyearday.length;
   var yearPointer;

   // Breaks
   if ( !yeardaysCount ) return false;
   // --------------------------------

   // Go to first day of the year
   pointer.setMonth( 0, 1 );


   for ( i; i < yeardaysCount; i += 1 ) {

     // Reset to pointer
     yearPointer = new Date( pointer );

     // Set correct date
     yearPointer.setDate( rrule.byyearday[i] );

     // Add
     if ( !options.add( yearPointer ) ) return false;
   }

  // Keep loop going
  return true;
};


module.exports = IteratorYearly;
