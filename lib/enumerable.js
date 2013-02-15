/**
 * Module Dependencies
 */

var toFunction = require('to-function'),
    proto = {};

/**
 * Mixin to `obj`.
 *
 *    var Enumerable = require('enumerable');
 *    Enumerable(Something.prototype);
 *
 * @param {Object} obj
 * @return {Object} obj
 */

module.exports = function(obj) {
  for(var key in proto) obj[key] = proto[key];
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

proto.forEach =
proto.each = function(fn){
  var arr = this,
      len = arr.length;

  for (var i = 0; i < len; i++) {
    fn(arr[i], i);
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

proto.map = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length;

  for (var i = 0; i < len; ++i) {
    arr[i] = fn(arr[i], i);
  }

  return this;
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

proto.filter =
proto.select = function(fn){
  fn = toFunction(fn);
  var out = [],
      arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (fn(val, i)) out.push(val);
  }

  return new arr.constructor(out);
};

/**
 * Select all unique values.
 *
 *    nums.unique()
 *
 * @return {Enumerable}
 * @api public
 */

proto.unique = function(){
  var out = [],
      arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (~arr.indexOf(val)) continue;
    out.push(val);
  }

  return new arr.constructor(out);
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

proto.reject = function(fn){
  var out = [],
      arr = this,
      len = arr.length,
      val, i;

  if ('string' == typeof fn) fn = toFunction(fn);
  if (fn) {
    for (i = 0; i < len; ++i) {
      val = arr[i];
      if (!fn(arr[i], i)) out.push(val);
    }
  } else {
    for (i = 0; i < len; ++i) {
      val = arr[i];
      if (val != fn) out.push(val);
    }
  }

  return new arr.constructor(out);
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


proto.compact = function(){
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

proto.find = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (fn(val, i)) return val;
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

proto.findLast = function (fn) {
    fn = toFunction(fn);
	var arr = this,
	i = arr.length;

	while(i--) if (fn(arr[i], i)) return arr[i];
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

proto.every = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (!fn(val, i)) return false;
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

proto.none = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (fn(val, i)) return false;
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

proto.any = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (fn(val, i)) return true;
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

proto.count = function(fn){
  fn = toFunction(fn);
  var n = 0,
      arr = this,
      len = arr.length,
      val;

  if(!fn) return len;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
    if (fn(val, i)) ++n;
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

proto.indexOf = function(obj) {
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr[i];
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

proto.has = function(obj) {
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

proto.reduce = function(fn, init){
  var arr = this,
      len = arr.length,
      i = 0,
      val;

  val = null == init
    ? arr.get(i++)
    : init;

  for (; i < len; ++i) {
    val = fn(val, arr[i], i);
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

proto.max = function(fn){
  var arr = this,
      len = arr.length,
      max = -Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn(arr[i], i);
      max = n > max ? n : max;
    }
  } else {
    for (i = 0; i < len; ++i) {
      n = arr[i];
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

proto.min = function(fn){
  var arr = this,
      len = arr.length,
      min = Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn(arr[i], i);
      min = n < min ? n : min;
    }
  } else {
    for (i = 0; i < len; ++i) {
      n = arr[i];
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

proto.sum = function(fn){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn(arr[i], i);
    }
  } else {
    for (i = 0; i < len; ++i) {
      n += arr[i];
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

proto.avg =
proto.mean = function(fn){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn(arr[i], i);
    }
  } else {
    for (i = 0; i < len; ++i) {
      n += arr[i];
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

proto.first = function(n) {
  var arr = this;

  if(!n) return arr[0];
  else if ('number' !== typeof n) return this.find(n);

  var len = Math.min(n, arr.length),
      out = new Array(len);

  for (var i = 0; i < len; ++i) {
    out[i] = out[i];
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

proto.last = function(n){
  var arr = this,
      len = arr.length;

  if(!n) return arr[len - 1];
  else if ('number' !== typeof n) return this.findLast(n);

  var i = Math.max(0, len - n),
      out = [];

  for (; i < len; ++i) {
    out.push(arr[i]);
  }

  return out;
};
