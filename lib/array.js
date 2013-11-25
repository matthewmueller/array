/**
 * Module dependencies
 */

var Enumerable = require('./enumerable');
var proto = Array.prototype;
var isArray = Array.isArray || require('isArray');

try {
  var Emitter = require('emitter');
} catch(e) {
  var Emitter = require('emitter-component');
}

/*
 * Expose `array`
 */

module.exports = array;

/**
 * Initialize `array`
 *
 * @param {Array|Object|Undefined} arr
 * @return {array}
 * @api public
 */

function array(arr) {
  if(!(this instanceof array)) return new array(arr);
  arr = arr || [];

  if (isArray(arr)) {
    // create array-like object
    var len = this.length = arr.length;
    for(var i = 0; i < len; i++) this[i] = arr[i];
  } else if ('object' == typeof arr) {
    // mixin to another object
    for(var key in array.prototype) arr[key] = array.prototype[key];
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
 * @api public
 */

array.prototype.pop = function() {
  var ret = proto.pop.apply(this, arguments);
  this.emit('remove', ret, this.length);
  return ret;
};

/**
 * Push a value onto the end of the array,
 * returning the length of the array
 *
 * @param {Mixed, ...} elements
 * @return {Number}
 * @api public
 */

array.prototype.push = function() {
  var ret = proto.push.apply(this, arguments),
      args = [].slice.call(arguments);
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i], ret - len + i);
  return ret;
};

/**
 * Removes the first element from an array and returns that element.
 *
 * @return {Mixed}
 * @api public
 */

array.prototype.shift = function() {
  var ret = proto.shift.apply(this, arguments);
  this.emit('remove', ret, 0);
  return ret;
};

/**
 * Adds and/or removes elements from an array.
 *
 * @param {Number} index
 * @param {Number} howMany
 * @param {Mixed, ...} elements
 * @return {Array} removed elements
 * @api public
 */

array.prototype.splice = function(index) {
  var ret = proto.splice.apply(this, arguments),
      added = [].slice.call(arguments, 2);
  for(var i = 0, len = ret.length; i < len; i++) this.emit('remove', ret[i], index + i);
  for(    i = 0, len = added.length; i < len; i++) this.emit('add', added[i], index + i);
  return ret;
};

/**
 * Adds one or more elements to the front of an array
 * and returns the new length of the array.
 *
 * @param {Mixed, ...} elements
 * @return {Number} length
 * @api public
 */

array.prototype.unshift = function() {
  var ret = proto.unshift.apply(this, arguments),
      args = [].slice.call(arguments);
  for(var i = 0, len = args.length; i < len; i++) this.emit('add', args[i], i);
  return ret;
};

/**
 * toJSON
 *
 * @return {Object}
 * @api public
 */

array.prototype.toJSON = function() {
  return this.map(function(obj) {
    return (obj.toJSON) ? obj.toJSON() : obj;
  }).toArray();
}

/**
 * Convert the array-like object to an actual array
 *
 * @return {Array}
 * @api public
 */
array.prototype.toArray  = function() {
  return proto.slice.call(this);
};

/**
 * Attach the rest of the array methods
 */

var methods = ['toString', 'reverse', 'concat', 'join', 'slice'];

methods.forEach(function(method) {
  array.prototype[method] = function() {
    return proto[method].apply(this, arguments);
  };
});
