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
 *
 * @param {Array} arr
 * @return {array}
 */

function array(arr) {
  arr = arr || [];
  if(!(this instanceof array)) return new array(arr);
  return mixin(arr);
}

/**
 * Inherit from `Emitter`
 */

Emitter(array.prototype);

/**
 * Removes the last element from an array and returns that element
 *
 * @return {Mixed} removed element
 */

array.prototype.pop = function() {
  var ret = proto.pop.apply(this, arguments);
  this.emit('pop', ret);
  this.emit('remove', ret);
  return ret;
};

/**
 * Push a value onto the end of the array,
 * returning the length of the array
 *
 * @param {Mixed, ...} elements
 * @return {Number}
 */

array.prototype.push = function() {
  var ret = proto.push.apply(this, arguments),
      args = [].slice.call(arguments);
  this.emit('push', ret);
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i]);
  return ret;
};

/**
 * Reverses an array in place.
 *
 * @return {Array}
 */

array.prototype.reverse = function() {
  var ret = proto.reverse.apply(this, arguments);
  this.emit('reverse', ret);
  return ret;
};

/**
 * Removes the first element from an array and returns that element.
 *
 * @return {Mixed}
 */

array.prototype.shift = function() {
  var ret = proto.shift.apply(this, arguments);
  this.emit('shift', ret);
  this.emit('remove', ret);
  return ret;
};

/**
 * Sorts the elements of an array.
 *
 * @return {Array}
 */

array.prototype.sort = function() {
  var ret = proto.sort.apply(this, arguments);
  this.emit('sort', ret);
  return ret;
};

/**
 * Adds and/or removes elements from an array.
 *
 * @param {Number} index
 * @param {Number} howMany
 * @param {Mixed, ...} elements
 * @return {Array} removed elements
 */

array.prototype.splice = function() {
  var ret = proto.splice.apply(this, arguments),
      added = [].slice.call(arguments, 2);
  this.emit('splice', ret);
  for(var i = 0, len = ret.length; i < len; i++) this.emit('remove', ret[i]);
  for(    i = 0, len = added.length; i < len; i++) this.emit('add', added[i]);
  return ret;
};

/**
 * Adds one or more elements to the front of an array
 * and returns the new length of the array.
 *
 * @param {Mixed, ...} elements
 * @return {Number} length
 */

array.prototype.unshift = function() {
  var ret = proto.unshift.apply(this, arguments),
      args = [].slice.call(arguments);
  this.emit('unshift', ret);
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i]);
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
