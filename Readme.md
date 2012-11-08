
# array

A more vocal array

Properly mixes an event emitter into your arrays, without modifying `Array.prototype` and leaving all the original functionality intact.

## Example

```js
var array = require('array'),
    arr = array(['a', 'b', 'c']);

arr.on('add', function(val) {
  console.log('added', val);
})

arr.on('remove', function(val) {
  console.log('removed', val);
})

arr.on('reverse', function(arr) {
  console.log('reversed', arr);
})

arr.push('d');
arr.shift();
arr.reverse();
console.log(arr.length) // 3;
```

## Installation

    $ component install matthewmueller/array

## Events

* `add` (item, ...) - emitted when elements are added to the array (push, unshift, splice)
* `remove` (item, ...) - emitted when elements are removed from the array (pop, shift, splice)
* `pop` (item) - emits the removed array item
* `push` (length) - emits the new length of the array
* `reverse` (array) - emits the reversed array
* `shift` - emitted when elements are shifted off the array
* `sort` - emitted when an array is sorted
* `splice` - emitted when an array is spliced
* `unshift` - emitted when elements are added to the front of the array

## Design

All array mutator functions emit events. Those events will simply emit the return value of the array.

The higher-level `add` and `remove` events will be emitted when elements are added or removed from the array. If more than one element is added to the array, the `add` event will pass additional arguments.

```js
arr.on('add', function(one, two) {
  console.log(one, two); // "hi" "hello"
})

arr.push('hi', 'hello')
```

## API

The API is the same as the mutator functions of a normal array. See [MDN: Array.prototype](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods) for more information.

## License

  MIT
