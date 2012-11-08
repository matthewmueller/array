
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

* `add` (item, ...) - emitted when items are added to the array (push, unshift, splice)
* `remove` (item, ...) - emitted when items are removed from the array (pop, shift, splice)
* `pop` (item) - emits the removed array item
* `push` (length) - emits the new length of the array
* `reverse` (array) - emits the reversed array
* `shift` (item) - emits the removed item
* `sort` (array) - emits the sorted array
* `splice` (array) - emits the removed items
* `unshift` (length) - emits the new length of the array

## Design

All array mutator functions emit events. Those events will simply emit the return value of the array.

The higher-level `add` and `remove` events will be emitted when items are added or removed from the array. If more than one item is added to the array, the `add` event will be emitted for each added item

```js
arr.on('add', function(one) {
  console.log(one); // called twice: "hi" then "hello"
})

arr.push('hi', 'hello')
```

One of the more interesting functions is `splice` that can both add and remove items. Both `add` and `remove` events may be emitted.

```js
var arr = array([1, 2, 3])

arr.on('add', function(val) {
  console.log('added', val) // called twice: "added a" then "added b"
})

arr.on('remove', function(val) {
  console.log('removed', val) // removed 2
})

arr.splice(1, 2, 'a', 'b')
console.log(arr); // [1, "a", "b"]
```

## API

The API is the same as the mutator functions of a normal array. See [MDN: Array.prototype](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/prototype#Mutator_methods) for more information.

## License

  MIT
