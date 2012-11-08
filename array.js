/**
 * Module dependencies
 */

var Emitter = require('emitter');

/**
 * Expose `array`
 */

module.exports = array;

/**
 * Array prototype
 */

var proto = Array.prototype;

/**
 * Initalize `array`
 */

function array(arr) {
  if(!(this instanceof array)) return new array(arr);
  Emitter.call(this);
  return mixin(arr);
}

/**
 * Inherit from `Emitter`
 */

Emitter(array.prototype);

/**
 * Removes the last element from an array and returns that element.
 */

array.prototype.pop = function() {
  var ret = proto.pop.apply(this, arguments);
  console.log('return', ret);
  this.emit('pop', ret);
  this.emit('remove', ret);
  return ret;
};

/**
 * Push a value onto the end of the array
 */

array.prototype.push = function() {
  var ret = proto.push.apply(this, arguments),
      args = [].slice.call(arguments);
  this.emit(this, 'push', args);
  this.emit(this, 'add', args);
  return ret;
};

/**
 * Reverses an array in place.
 */

array.prototype.reverse = function() {
  var ret = proto.reverse.apply(this, arguments);
  this.emit('reverse', ret);
  return ret;
};

/**
 * Removes the first element from an array and returns that element.
 */

array.prototype.shift = function() {
  var ret = proto.shift.apply(this, arguments);
  this.emit('shift', ret);
  this.emit('remove', ret);
  return ret;
};

/**
 * Sorts the elements of an array.
 */

array.prototype.sort = function() {
  var ret = proto.sort.apply(this, arguments);
  this.emit('sort', ret);
  return ret;
};

/**
 * Adds and/or removes elements from an array.
 */

array.prototype.splice = function() {
  var ret = proto.splice.apply(this, arguments);
  this.emit('splice', ret);
  this.emit('remove', ret);
  return ret;
};

/**
 * Adds one or more elements to the front of an array
 * and returns the new length of the array.
 */

array.prototype.unshift = function() {
  var ret = proto.unshift.apply(this, arguments),
      args = [].slice.call(arguments);
  this.emit('unshift', args);
  this.emit('add', args);
  return ret;
};

/**
 * Mixin to `arr`.
 *
 *    var array = require('array');
 *    array(Something.prototype);
 *
 * @param {Object} arr
 * @return {Object} arr
 */

function mixin(arr){
  for (var key in array.prototype)
    arr[key] = array.prototype[key];
  return arr;
}
