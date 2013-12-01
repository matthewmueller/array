;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-props/index.js", function(exports, require, module){
/**
 * Global Names
 */

var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @param {String|Function} map function or prefix
 * @return {Array}
 * @api public
 */

module.exports = function(str, fn){
  var p = unique(props(str));
  if (fn && 'string' == typeof fn) fn = prefixed(fn);
  if (fn) return map(str, p, fn);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(globals, '')
    .match(/[a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` mapped with `fn`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {Function} fn
 * @return {String}
 * @api private
 */

function map(str, props, fn) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~props.indexOf(_)) return _;
    return fn(_);
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

/**
 * Map with prefix `str`.
 */

function prefixed(str) {
  return function(_){
    return str + _;
  };
}

});
require.register("component-to-function/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

try {
  var expr = require('props');
} catch(e) {
  var expr = require('props-component');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val;
  for(var i = 0, prop; prop = props[i]; i++) {
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";
    str = str.replace(new RegExp(prop, 'g'), val);
  }

  return str;
}

});
require.register("yields-isArray/index.js", function(exports, require, module){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Wether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

});
require.register("array/index.js", function(exports, require, module){
module.exports = require('./lib/array');

});
require.register("array/lib/array.js", function(exports, require, module){
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
  for(var i = 0, len = ret.length; i < len; i++) this.emit('remove', ret[i], index);
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

var methods = ['toString', 'reverse', 'concat', 'join', 'slice'];

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

});
require.register("array/lib/enumerable.js", function(exports, require, module){
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
enumerable.each = function(fn){
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

enumerable.map = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length;

  for (var i = 0; i < len; ++i) {
    arr[i] = fn(arr.get(arr[i]), i);
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

enumerable.filter =
enumerable.select = function(fn){
  fn = toFunction(fn);
  var out = [],
      arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn(val, i)) out.push(arr[i]);
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

enumerable.unique = function(fn){
  var out = [],
      vals = [],
      arr = this,
      len = arr.length,
      val;

  fn = (fn) ? toFunction(fn) : function(o) { return o; };

  for (var i = 0; i < len; ++i) {
    val = fn(arr.get(arr[i]));
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

enumerable.reject = function(fn){
  var out = [],
      arr = this,
      len = arr.length,
      val, i;

  if ('string' == typeof fn) fn = toFunction(fn);
  if (fn) {
    for (i = 0; i < len; ++i) {
      val = arr.get(arr[i]);
      if (!fn(val, i)) out.push(arr[i]);
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

enumerable.find = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
    if (fn(val, i)) return arr[i];
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

enumerable.findLast = function (fn) {
    fn = toFunction(fn);
  var arr = this,
  i = arr.length;

  while(i--) if (fn(arr.get(arr[i]), i)) return arr[i];
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

enumerable.every = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
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

enumerable.none = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
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

enumerable.any = function(fn){
  fn = toFunction(fn);
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
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

enumerable.count = function(fn){
  fn = toFunction(fn);
  var n = 0,
      arr = this,
      len = arr.length,
      val;

  if(!fn) return len;

  for (var i = 0; i < len; ++i) {
    val = arr.get(arr[i]);
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

enumerable.indexOf = function(obj) {
  var arr = this,
      len = arr.length,
      val;

  for (var i = 0; i < len; ++i) {
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

enumerable.lastIndexOf = function(obj) {
  var arr = this,
      len = arr.length,
      val;

  for (var i = --len; i >= 0; --i) {
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
    val = fn(val, arr.get(arr[i]), i);
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

enumerable.max = function(fn){
  var arr = this,
      len = arr.length,
      max = -Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn(arr.get(arr[i]), i);
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

enumerable.min = function(fn){
  var arr = this,
      len = arr.length,
      min = Infinity,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n = fn(arr.get(arr[i]), i);
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

enumerable.sum = function(fn){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn(arr.get(arr[i]), i);
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
enumerable.mean = function(fn){
  var arr = this,
      len = arr.length,
      n = 0,
      val, i;

  if (fn) {
    fn = toFunction(fn);
    for (i = 0; i < len; ++i) {
      n += fn(arr.get(arr[i]), i);
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

enumerable.first = function(n) {
  var arr = this;

  if(!n) return arr[0];
  else if ('number' !== typeof n) return this.find(n);

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

enumerable.last = function(n){
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

});






require.alias("component-emitter/index.js", "array/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-to-function/index.js", "array/deps/to-function/index.js");
require.alias("component-to-function/index.js", "to-function/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("yields-isArray/index.js", "array/deps/isArray/index.js");
require.alias("yields-isArray/index.js", "isArray/index.js");
if (typeof exports == "object") {
  module.exports = require("array");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("array"); });
} else {
  this["array"] = require("array");
}})();