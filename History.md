
0.3.2 / 2013-11-26
==================

 * remake array to conserve context.
 * fixed unique()

0.3.1 / 2013-11-24
==================

 * update index in remove event when splicing multiple items

0.3.0 / 2013-11-24
==================

 * added array mixin support
 * added lastIndexOf(n) for IE
 * added index for add and remove events
 * updated emitter to 1.1.0
 * updated to-function to feature branch "getter/fns"

0.2.1 / 2013-03-11
==================

  * updated toJSON() (@rschmukler)

0.2.0 / 2013-02-28
==================

  * fixed toString
  * added toArray()
  * added sort(str)
  * readme cleanup

0.1.2 / 2013-02-27
==================

  * remove github-style dependencies
  * added .hash(key)

0.1.1 / 2013-02-27
==================

  * fix emitter

0.1.0 / 2013-02-14
==================

  * Updated API and readme
  * Added enumerable methods
  * Removed events for all mutator functions
  * Tests

0.0.2 / 2012-11-08
==================

  * api change: when you push, unshift, or splice more than 1 element, add and remove events will be called for each element added/removed
  * Only emit add if values actually added

0.0.1 / 2012-11-08
==================

  * Initial commit
