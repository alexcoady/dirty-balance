function IteratorDaily () {}


/**
 *
 *  @param {RRule} rrule The current recurrance rule
 *  @param {Object} options RRule loop options
 *  @param {Date} pointer The provided date to work from
 *  @return {Bool} true if master loop should continue
 */
 IteratorDaily.list = function ( rrule, options, pointer ) {

  if ( options.add(pointer) ) return true;

  return false;
};


module.exports = IteratorDaily;
