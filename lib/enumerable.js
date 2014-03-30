/**
 * Module Dependencies
 */

var toFunction = require('to-function'),
    proto = Array.prototype,
    enumerable = {};

/**
 * Mixin to `obj`.
 *
 *    var Enumerable = require('enumerable');
 *    Enumerable(Something.prototype);
 *
 * @param {Object} obj
 * @return {Object} obj
 * @api private
 */

module.exports = function(obj) {
  for(var key in enumerable) obj[key] = enumerable[key];
  return obj;
};

/**
 * Iterate each value and invoke `fn(val, i)`.
 *
 *    users.each(function(val, i){
 *
 *    })
 *
 * @param {Function} fn
 * @return {Object} self
 * @api public
 */

enumerable.forEach =
enumerable.each = function(fn, context){
  var arr = this,
      len = arr.length;

  for (var i = 0; i < len; i++) {
    fn.call(context, arr[i], i, arr);
  }

  return this;
};

/**
 * Map each return value from `fn(val, i)`.
 *
 * Passing a callback function:
 *
 *    users.map(function(user){
 *      return user.name.first
 *    })
 *
 * Passing a property string:
 *
 *    users.map('name.first')
 *
 * @param {Function} fn
 * @return {Enumerable}
 * @api public
 */

enumerable.map = function(fn, context){
  fn = toFunction(fn);
  var out = [],
      arr = this,
      len = arr.length;

  for (var i = 0; i < len; ++i) {
    out.push(fn.call(context, arr.get(arr[i]), i, arr));
  }

  return this._remake(out);
};

/**
 * Select all values that return a truthy value of `fn(val, i)`.
 *
 *    users.select(function(user){
 *      return user.age > 20
 *    })
 *
 *  With a property:
 *
 *    items.select('complete')
 *
 * @param {Function|String} fn
 * @return {Enumerable}
 * @api public
 */

enumerable.filter =
enumerable.select = function(fn, context){
  fn = toFunction(fn);
  var out = [],
      arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn.call(context, val, i, arr)) out.push(arr[i]);
  }

  return this._remake(out);
};

/**
 * Select all unique values.
 *
 *    nums.unique()
 *
 * @param {Function|String} fn
 * @return {Enumerable}
 * @api public
 */

enumerable.unique = function(fn, context){
  var out = [],
      vals = [],
      arr = this,
      len = arr.length,
      val;

  fn = (fn) ? toFunction(fn) : function(o) { return o; };

  for (var i = 0; i < len; ++i) {
    val = fn.call(context, arr.get(arr[i]), i, arr);
    if (~vals.indexOf(val)) continue;
    vals.push(val);
    out.push(arr[i]);
  }

  return this._remake(out);
};

/**
 * Reject all values that return a truthy value of `fn(val, i)`.
 *
 * Rejecting using a callback:
 *
 *    users.reject(function(user){
 *      return user.age < 20
 *    })
 *
 * Rejecting with a property:
 *
 *    items.reject('complete')
 *
 * Rejecting values via `==`:
 *
 *    data.reject(null)
 *    users.reject(tobi)
 *
 * @param {Function|String|Mixed} fn
 * @return {Enumerable}
 * @api public
 */

enumerable.reject = function(fn, context){
  var out = [],
      arr = this,
      len = arr.length,
      val, i;

  if ('string' == typeof fn) fn = toFunction(fn);
  if (fn) {
    for (i = 0; i < len; ++i) {
      val = arr.get(arr[i]);
      if (!fn.call(context, val, i, arr)) out.push(arr[i]);
    }
  } else {
    for (i = 0; i < len; ++i) {
      val = arr.get(arr[i]);
      if (val != fn) out.push(arr[i]);
    }
  }

  return this._remake(out);
};

/**
 * Reject `null` and `undefined`.
 *
 *    [1, null, 5, undefined].compact()
 *    // => [1,5]
 *
 * @return {Enumerable}
 * @api public
 */


enumerable.compact = function(){
  return this.reject(null);
};

/**
 * Return the first value when `fn(val, i)` is truthy,
 * otherwise return `undefined`.
 *
 *    users.find(function(user){
 *      return user.role == 'admin'
 *    })
 *
 * With a property string:
 *
 *    users.find('age > 20')
 *
 * @param {Function|String} fn
 * @return {Mixed}
 * @api public
 */

enumerable.find = function(fn, context){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn.call(context, val, i, arr)) return arr[i];
  }
};

/**
 * Return the last value when `fn(val, i)` is truthy,
 * otherwise return `undefined`.
 *
 *    users.findLast(function(user){
 *      return user.role == 'admin'
 *    })
 *
 * @param {Function} fn
 * @return {Mixed}
 * @api public
 */

enumerable.findLast = function (fn, context) {
    fn = toFunction(fn);
  var arr = this,
  i = arr.length;

  while(i--) if (fn.call(context, arr.get(arr[i]), i, arr)) return arr[i];
};

/**
 * Assert that all invocations of `fn(val, i)` are truthy.
 *
 * For example ensuring that all pets are ferrets:
 *
 *    pets.all(function(pet){
 *      return pet.species == 'ferret'
 *    })
 *
 *    users.all('admin')
 *
 * @param {Function|String} fn
 * @return {Boolean}
 * @api public
 */

enumerable.every = function(fn, context){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (!fn.call(context, val, i, arr)) return false;
  }

  return true;
};

/**
 * Assert that none of the invocations of `fn(val, i)` are truthy.
 *
 * For example ensuring that no pets are admins:
 *
 *    pets.none(function(p){ return p.admin })
 *    pets.none('admin')
 *
 * @param {Function|String} fn
 * @return {Boolean}
 * @api public
 */

enumerable.none = function(fn, context){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn.call(context, val, i, arr)) return false;
  }
  return true;
};

/**
 * Assert that at least one invocation of `fn(val, i)` is truthy.
 *
 * For example checking to see if any pets are ferrets:
 *
 *    pets.any(function(pet){
 *      return pet.species == 'ferret'
 *    })
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api public
 */

enumerable.any =
enumerable.some = function(fn, context){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn.call(context, val, i, arr)) return true;
  }
  return false;
};

/**
 * Count the number of times `fn(val, i)` returns true.
 *
 *    var n = pets.count(function(pet){
 *      return pet.species == 'ferret'
 *    })
 *
 * @param {Function} fn
 * @return {Number}
 * @api public
 */

enumerable.count = function(fn, context){
  fn = toFunction(fn);
  var n = 0,
      arr = this,
      len = arr.length,
      val;

  if(!fn) return len;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn.call(context, val, i, arr)) ++n;
  }
  return n;
};

/**
 * Determine the indexof `obj` or return `-1`.
 *
 * @param {Mixed} obj
 * @return {Number}
 * @api public
 */

enumerable.indexOf = function(obj, fromIndex) {
  var arr = this,
      len = arr.length,
      val,
      start = 0;

  if (fromIndex !== undefined){
    start = fromIndex < 0 ? fromIndex + len : fromIndex;
  }

  for (var i = start; i < len; ++i) {
    val = arr.get(arr[i]);
    if (val === obj) return i;
  }

  return -1;
};

/**
 * Determine the last indexof `obj` or return `-1`.
 *
 * @param {Mixed} obj
 * @return {Number}
 * @api public
 */

enumerable.lastIndexOf = function(obj, fromIndex) {
  var arr = this,
      len = arr.length,
      val,
      start = len - 1;

  if (fromIndex !== undefined){
    start = fromIndex < 0 ? fromIndex + len : fromIndex;
  }

  for (var i = start; i >= 0; --i) {
    val = arr.get(arr[i]);
    if (val === obj) return i;
  }

  return -1;
};

/**
 * Check if `obj` is present in this enumerable.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api public
 */

enumerable.has = function(obj) {
  return !! ~this.indexOf(obj);
};

/**
 * Reduce with `fn(accumulator, val, i)` using
 * optional `init` value defaulting to the first
 * enumerable value.
 *
 * @param {Function} fn
 * @param {Mixed} [val]
 * @return {Mixed}
 * @api public
 */

enumerable.reduce = function(fn, init){
  var arr = this,
      len = arr.length,
      i = 0,
      val;

  val = null == init
    ? arr.get(i++)
    : init;

  for (; i < len; ++i) {
    val = fn(val, arr.get(arr[i]), i, arr);
  }

  return val;
};

/**
 * Reduce with `fn(accumulator, val, i)` using
 * optional `init` value defaulting to the first
 * enumerable value - like reduce, except from right
 * to left.
 *
 * @param {Function} fn
 * @param {Mixed} [val]
 * @return {Mixed}
 * @api public
 */

enumerable.reduceRight = function(fn, init){
  var arr = this,
      len = arr.length,
      i = len,
      val;

  val = null == init
    ? arr.get(i++)
    : init;

  for (; i--;) {
    val = fn(val, arr.get(arr[i]), i, arr);
  }

  return val;
};

/**
 * Determine the max value.
 *
 * With a callback function:
 *
 *    pets.max(function(pet){
 *      return pet.age
 *    })
 *
 * With property strings:
 *
 *    pets.max('age')
 *
 * With immediate values:
 *
 *    nums.max()
 *
 * @param {Function|String} fn
 * @return {Number}
 * @api public
 */

enumerable.max = function(fn, context){
  var arr = this,
      len = arr.length,
      max = -Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn.call(context, arr.get(arr[i]), i, arr);
      max = n > max ? n : max;
    }
  } else {
    for (i = 0; i < len; ++i) {
      n = arr.get(arr[i]);
      max = n > max ? n : max;
    }
  }

  return max;
};

/**
 * Determine the min value.
 *
 * With a callback function:
 *
 *    pets.min(function(pet){
 *      return pet.age
 *    })
 *
 * With property strings:
 *
 *    pets.min('age')
 *
 * With immediate values:
 *
 *    nums.min()
 *
 * @param {Function|String} fn
 * @return {Number}
 * @api public
 */

enumerable.min = function(fn, context){
  var arr = this,
      len = arr.length,
      min = Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn.call(context, arr.get(arr[i]), i, arr);
      min = n < min ? n : min;
    }
  } else {
    for (i = 0; i < len; ++i) {
      n = arr.get(arr[i]);
      min = n < min ? n : min;
    }
  }

  return min;
};

/**
 * Determine the sum.
 *
 * With a callback function:
 *
 *    pets.sum(function(pet){
 *      return pet.age
 *    })
 *
 * With property strings:
 *
 *    pets.sum('age')
 *
 * With immediate values:
 *
 *    nums.sum()
 *
 * @param {Function|String} fn
 * @return {Number}
 * @api public
 */

enumerable.sum = function(fn, context){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn.call(context, arr.get(arr[i]), i, arr);
    }
  } else {
    for (i = 0; i < len; ++i) {
      n += arr.get(arr[i]);
    }
  }

  return n;
};

/**
 * Determine the average value.
 *
 * With a callback function:
 *
 *    pets.avg(function(pet){
 *      return pet.age
 *    })
 *
 * With property strings:
 *
 *    pets.avg('age')
 *
 * With immediate values:
 *
 *    nums.avg()
 *
 * @param {Function|String} fn
 * @return {Number}
 * @api public
 */

enumerable.avg =
enumerable.mean = function(fn, context){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn.call(context, arr.get(arr[i]), i, arr);
    }
  } else {
    for (i = 0; i < len; ++i) {
      n += arr.get(arr[i]);
    }
  }

  return n / len;
};

/**
 * Return the first value, or first `n` values.
 *
 * @param {Number|Function} [n]
 * @return {Array|Mixed}
 * @api public
 */

enumerable.first = function(n, context) {
  var arr = this;

  if(!n) return arr[0];
  else if ('number' !== typeof n) return this.find(n, context);

  var len = Math.min(n, arr.length),
      out = new Array(len);

  for (var i = 0; i < len; ++i) {
    out[i] = arr[i];
  }

  return out;

};

/**
 * Return the last value, or last `n` values.
 *
 * @param {Number|Function} [n]
 * @return {Array|Mixed}
 * @api public
 */

enumerable.last = function(n, context){
  var arr = this,
      len = arr.length;

  if(!n) return arr[len - 1];
  else if ('number' !== typeof n) return this.findLast(n, context);

  var i = Math.max(0, len - n),
      out = [];

  for (; i < len; ++i) {
    out.push(arr[i]);
  }

  return out;
};

/**
 * Create a hash from a given `key`
 *
 * @param {String} key
 * @return {Object}
 * @api public
 */

enumerable.hash = function(str) {
  var arr = this,
      len = arr.length,
      out = {},
      key;

  for (var i = 0, len = arr.length; i < len; i++) {
    key = arr.get(arr[i])[str];
    // TODO: assess, maybe we want out[i] = arr.get(i)
    if(!key) continue;
    out[key] = arr[i];
  };

  return out;
};

/**
 * Sort the array.
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

enumerable.sort = function(fn, dir) {
  dir = (dir !== undefined) ? dir : 1;
  var sort = proto.sort;
  if(!fn) return sort.apply(this);
  else if('function' == typeof fn) return sort.apply(this, arguments);

  var self = this;
  fn = toFunction(fn);

  // support ascending and descending directions
  if('string' == typeof dir) {
    if(/asc/.test(dir)) dir = 1;
    else if(/des/.test(dir)) dir = -1;
  } else if('boolean' == typeof dir) {
    dir = (dir) ? 1 : -1;
  }

  function compare(a, b) {
    a = fn(self.get(a)), b = fn(self.get(b));
    if(a < b) return -(dir);
    else if(a > b) return dir;
    return 0
  };

  return sort.call(this, compare);
};
