/**
 * Module dependencies
 */

var Emitter = require('emitter'),
    Enumerable = require('./enumerable'),
    proto = Array.prototype;

/*
 * Expose `array`
 */

module.exports = array;

/**
 * Initialize `array`
 */

function array(arr) {
  if(!(this instanceof array)) return new array(arr);
  arr = arr || [];

  // array-like
  var len = this.length = arr.length;
  for(var i = 0; i < len; i++) {
    this[i] = arr[i];
  }
}

/**
 * Mixin `Emitter`
 */

Emitter(array.prototype);

/**
 * Mixin `Enumerable`
 */

Enumerable(array.prototype);

/**
 * Removes the last element from an array and returns that element
 *
 * @return {Mixed} removed element
 */

array.prototype.pop = function() {
  var ret = proto.pop.apply(this, arguments);
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
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i]);
  return ret;
};

/**
 * Removes the first element from an array and returns that element.
 *
 * @return {Mixed}
 */

array.prototype.shift = function() {
  var ret = proto.shift.apply(this, arguments);
  this.emit('remove', ret);
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
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i]);
  return ret;
};

/**
 * toString
 */

array.prototype.toString =
array.prototype.toJSON   = function() {
  return proto.slice.call(this);
};

/**
 * Attach the rest of the array methods
 */

var methods = ['sort', 'reverse', 'concat', 'join', 'slice', 'lastIndexOf'];

methods.forEach(function(method) {
  array.prototype[method] = function() {
    return proto[method].apply(this, arguments);
  };
});
