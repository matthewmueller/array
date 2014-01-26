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
    if (isObjectLiteral(arr)) {
      arr._ctx = this._ctx = JSON.parse(JSON.stringify(arr));
    }

    // mixin to another object
    for(var key in array.prototype) arr[key] = array.prototype[key];
    return arr;
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
  this.emit('change');
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
  this.emit('change');
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
  this.emit('change');
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
  for(var i = 0, len = ret.length; i < len; i++) this.emit('remove', ret[i], index);
  for(    i = 0, len = added.length; i < len; i++) this.emit('add', added[i], index + i);
  this.emit('change');
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
  this.emit('change');
  return ret;
};

/**
 * Reverses the array, emitting the `reverse` event
 *
 * @api public
 */

array.prototype.reverse = function () {
  var ret = proto.reverse.apply(this, arguments);
  this.emit('reverse');
  this.emit('change');
  return ret;
};

/**
 * Sort the array, emitting the `sort` event
 *
 * With strings:
 *
 *   fruits.sort('calories')
 *
 * Descending sort:
 *
 *   fruits.sort('calories', 'desc')
 *
 * @param {undefined|Function|String} fn
 * @param {Nunber|String|Boolean} dir
 * @return {Array}
 * @api public
 */
var sort = array.prototype.sort;
array.prototype.sort = function () {
  var ret = sort.apply(this, arguments);
  this.emit('sort');
  this.emit('change');
  return ret;
}


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
 * Static: get the array item
 *
 * @param {Mixed} obj
 * @return {Mixed}
 * @api public
 */

array.get = function(obj) {
  return obj;
};

/**
 * Get the array item
 *
 * @param {Number} i
 * @return {Mixed}
 * @api public
 */

array.prototype.get = array.get;

/**
 * Attach the rest of the array methods
 */

var methods = ['toString', 'concat', 'join', 'slice'];

methods.forEach(function(method) {
  array.prototype[method] = function() {
    return proto[method].apply(this, arguments);
  };
});

/**
 * Remake the array, emptying it, then adding values back in
 *
 * @api private
 */

array.prototype._remake = function(arr) {
  var construct = this.constructor;
  var clone = (this._ctx) ? new construct(this._ctx) : new construct();
  proto.push.apply(clone, arr);
  clone.get = this.get || array.get;
  return clone;
};

/**
 * Is object utility
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isObjectLiteral(obj) {
  return obj.constructor == Object;
}
