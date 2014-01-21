# array [![Build Status](https://secure.travis-ci.org/MatthewMueller/array.png?branch=master)](http://travis-ci.org/MatthewMueller/array) [![Build Status](https://david-dm.org/MatthewMueller/array.png)](https://david-dm.org/MatthewMueller/array) [![NPM version](https://badge.fury.io/js/array.js.png)](http://badge.fury.io/js/array.js)

A better array for the browser and node.js. Supports events & many functional goodies.

The functional bits are based off the [Enumerable](https://github.com/component/enumerable) component.

## Installation

### Node.js

    npm install array

### Browser with component

    component install matthewmueller/array

### Browser (standalone, amd, etc.)

* Development (24k): [dist/array.js](https://raw.github.com/MatthewMueller/array/master/dist/array.js)
* Production (4k w/ gzip): [dist/array.js](https://raw.github.com/MatthewMueller/array/master/dist/array.min.js)

> Note: if you use this library standalone, `array` will be attached to the window. You can access it with `window.array()` or just `array()`. Keep in mind javascript is case-sensitive and `Array()` will create a native array.

## Examples

### Iteration:

```js
users
  .map('friends')
  .select('age > 20 && age < 30')
  .map('name.first')
  .select(/^T/)
```

```js
fruits.find({ name : 'apple' }).color
```

```js
users.sort('name.last', 'descending')
```

### Events:

```js
var array = require('array'),
    users = array();

users.on('add', function(user) {
  console.log('added', user);
});

users.on('remove', function(user) {
  console.log('removed', user);
});

users.push(user);
users.splice(0, 3, user);
```

## Design

This library uses an array-like object to implement all its methods. This is very similar to how jQuery lets you do: `$('.modal')[0]` and `$('p').length`.

This library differs from `component/enumerable` in that it has events and does not wrap the array. To access the actual array in `component/enumerable` you have to call `.value()`. For the most part, you can treat `array` just like a real array, because it implements all the same methods.

## Caveats

When working with `array` it's important to keep in mind that `array` is not an actual Array, but an array-like object. There are a few caveats that come with this data type:

* you cannot manually set array indexes because the length value will not be updated. You will have to use the mutator methods provided like push, pop, etc.
* `arr instanceof Array` will return `false`. `arr instanceof Object` will return `true`. So there may be some interoperability issues if you try to blindly pass these arrays through other libraries.

Keep in mind both these issues are also present when working with jQuery objects as well as Backbone Collections.

## Events

* `add` (item, index) - emitted when items are added to the array (`push`, `unshift`, `splice`)
* `remove` (item, index) - emitted when items are removed from the array (`pop`, `shift`, `splice`)
* `sort` - emitted when array is sorted
* `reverse` - emitted when array is reversed
* `change` - emitted at most once for every mutating operation

An event will be emitted for each item you add or remove. So if you do something like:

```js
fruits.on('add', function(item) {});
fruits.push('apple', 'orange', 'pear')
```

The `add` event will be fired 3 times with the `item` being `"apple"`, `"orange"`, and `"pear"` respectively.

## API

#### `array(mixed)`

Initialize an `array`.

As an empty array:

```js
var arr = array();
```

As an array with values:

```js
var arr = array([1, 2, 3, 4]);
```

Or as a mixin:

```js
function Notes() {}
array(Notes.prototype);
```

### Array methods

`array` implements all the same methods as a native array. For more information, visit [MDN](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array).

#### Mutators:

Mutator methods that modify the array will emit "add" and "remove" events.

* `pop()`: Removes the last element from an array and returns that element.
* `push(item, ...)`: Adds one or more elements to the end of an array and returns the new length of the array.
* `reverse()`: Reverses the order of the elements of an array -- the first becomes the last, and the last becomes the first.
* `shift()`: Removes the first element from an array and returns that element.
* `splice(i, k, [item, ...])`: Adds and/or removes elements from an array.
* `unshift(item, ...)`: Adds one or more elements to the front of an array and returns the new length of the array.

#### Accessors:

* `concat(arr)`: Returns a new array comprised of this array joined with other array(s) and/or value(s).
* `join(str)`: Joins all elements of an array into a string.
* `slice(i, k)`: Extracts a section of an array and returns a new array.
* `toString()`: Returns a string representing the array and its elements. Overrides the Object.prototype.toString method.
* `lastIndexOf(item)`: Returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found.

### Iteration Methods:

`array` implements most of the methods of [component/enumerable](https://github.com/component/enumerable). The documentation below was originally written by [visionmedia](https://github.com/visionmedia).

#### `.each(fn)`

  Iterate each value and invoke `fn(val, i)`.

```js
users.each(function(val, i){})
```

#### `.map(fn|str)`

  Map each return value from `fn(val, i)`.

  Passing a callback function:

```js
users.map(function(user){
  return user.name.first
})
```


  Passing a property string:

```js
users.map('name.first')
```

#### `.select(fn|str)`

  Select all values that return a truthy value of `fn(val, i)`. The argument passed in can either be a function or a string.

```js
users.select(function(user){
  return user.age > 20
})
```

  With a property:

```js
items.select('complete')
```

  With a condition:

```js
users.select('age > 20')
```

#### `.unique(fn|str)`

  Select all unique values.

```js
nums.unique()
```

```js
users.unique('age')
```

#### `.reject(fn|str|mixed)`

  Reject all values that return a truthy value of `fn(val, i)`.

  Rejecting using a callback:

```js
users.reject(function(user){
  return user.age < 20
})
```


  Rejecting with a property:

```js
items.reject('complete')
```


  Rejecting values via `==`:

```js
data.reject(null)
users.reject(toni)
```

#### `.sort([str|fn], [direction])`

  Sorts the array

Basic sort:

```js
prices.sort()
```

Sort by the `created` key in ascending order. the following are equivalent:

```js
users.sort('created')
users.sort('created', 'ascending')
users.sort('created', 'asc')
users.sort('created', 1)
users.sort('created', true)
```

Sort in descending order. The following are equivalent:

```js
food.sort('calories', 'descending')
food.sort('calories', 'desc')
food.sort('calories', -1)
food.sort('calories', false)
```

Using a function:

```js
users.sort(function(user1, user2) {})
```

#### `.compact()`

  Reject `null` and `undefined`.

```js
[1, null, 5, undefined].compact()
// => [1,5]
```

#### `.find(fn)`

  Return the first value when `fn(val, i)` is truthy,
  otherwise return `undefined`.

```js
users.find(function(user){
  return user.role == 'admin'
})
```

#### `.findLast(fn)`

  Return the last value when `fn(val, i)` is truthy,
  otherwise return `undefined`.

```js
users.findLast(function(user){
  return user.role == 'admin'
})
```

#### `.none(fn|str)`

  Assert that none of the invocations of `fn(val, i)` are truthy.

  For example ensuring that no pets are admins:

```js
pets.none(function(p){ return p.admin })
pets.none('admin')
```

#### `.any(fn)`

  Assert that at least one invocation of `fn(val, i)` is truthy.

  For example checking to see if any pets are ferrets:

```js
pets.any(function(pet){
  return pet.species == 'ferret'
})
```

#### `.count(fn)`

  Count the number of times `fn(val, i)` returns true.

```js
var n = pets.count(function(pet){
  return pet.species == 'ferret'
})
```

#### `.indexOf(mixed)`

  Determine the indexof `mixed` or return `-1`.

#### `.has(mixed)`

  Check if `mixed` is present in this enumerable.

#### `.reduce(fn, mixed)`

  Reduce with `fn(accumulator, val, i)` using
  optional `init` value defaulting to the first
  enumerable value.

#### `.max(fn|str)`

  Determine the max value.

  With a callback function:

```js
pets.max(function(pet){
  return pet.age
})
```


  With property strings:

```js
pets.max('age')
```


  With immediate values:

```js
nums.max()
```

#### `.sum(fn|str)`

  Determine the sum.

  With a callback function:

```js
pets.sum(function(pet){
  return pet.age
})
```


  With property strings:

```js
pets.sum('age')
```

  With immediate values:

```js
nums.sum()
```

#### `.first([mixed])`

  Return the first value, or first `n` values. If you pass in an object or a function, first will call `find`.

#### `.last([mixed])`

  Return the last value, or last `n` values. If you pass in an object or function, last will call `findLast`.

#### `.hash(key)`

  Create a hash from the given `key`.

```js
var fruits = array();
fruits.push({ name : "apple", color : "red" });
fruits.push({ name : "pear", color : "green" });
fruits.push({ name : "orange", color : "orange" });

var obj = fruits.hash('name');
obj.apple //=> { name : "apple", color : "red" }
obj.pear //=> { name : "pear", color : "green" }
obj.orange //=> { name : "orange", color : "orange" }
```

#### toJSON()

Return an array. If array contains objects that implement `,toJSON()`, array.js will call `obj.toJSON()` on each item. Otherwise return the contents.

#### toArray()

Returns an native array.

## Benchmarks

Benchmarks are preliminary but also promising:

* native vs. array.js vs underscore.js: http://jsperf.com/native-vs-array-js-vs-underscore

## Run tests

    npm install .
    npm test

## License

(The MIT License)

Copyright (c) 2013 Matt Mueller <mattmuelle@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
