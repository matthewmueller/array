/**
 * Module Dependencies
 */

var array = require('../'),
    assert = require('better-assert');

/**
 * Array tests
 */

describe('array', function () {
  var arr;
  beforeEach(function() {
    arr = array();
  });

  it('() should initialize an empty array', function(){
    var arr = array();
    assert(0 === arr.length);
  });

  it('should be array-like', function () {
    var arr = array(['1', '2', '3']);
    assert(3 === arr.length);
    assert('1' === arr[0]);
    assert('2' === arr[1]);
    assert('3' === arr[2]);
  });

  it('should support mixins', function() {
    function Notes() {}
    array(Notes.prototype);
    var notes = new Notes();
    notes.push('1', '2', '3');
    assert(3 === notes.length);
    assert('1' === notes[0]);
    assert('2' === notes[1]);
    assert('3' === notes[2]);
  });

  describe('pop', function () {
    it('should pop() like [].pop()', function () {
      arr.push('1', '2');
      var val = arr.pop();
      assert('2' === val);
      assert('1' === arr[0]);
      assert(1 === arr.length);
    });

    it('should emit "remove" and "change" events', function() {
      arr.push('1', '2');
      arr.on('remove', function(v, i) {
        assert('2' === v);
        assert(1 === i);
      });
      var changeCalled = 0;
      arr.on('change', function () {
        changeCalled++;
      });
      arr.pop();
      assert(changeCalled === 1);
    });
  });

  describe('push', function () {
    it('should push() like [].push()', function(){
      arr.push('1', '2');
      assert(2 === arr.length);
    });

    it('should emit "add" and "change" events', function(){
      var calls = 0;
      arr.on('add', function(v, i) {
        switch (calls++) {
          case 0:
            assert('hi' === v);
            assert(0 === i);
            break;
          case 1:
            assert('world' === v);
            assert(1 === i);
            break;
        }
      });
      var changeCalled = 0;
      arr.on('change', function () {
        changeCalled++;
      });
      arr.push('hi', 'world');
      assert(changeCalled === 1);
    });
  });

  describe('shift', function () {
    it('should emit "remove" and "change" events', function () {
      arr.push('1', '2');
      arr.on('remove', function (v, i) {
        assert('1' === v);
        assert(0 === i);
      });
      var changeCalled = 0;
      arr.on('change', function () {
        changeCalled++;
      });
      arr.shift();
      assert(changeCalled === 1);
    });
  });

  describe('unshift', function () {
    it('should emit "add" and "change" events', function () {
      var calls = 0;
      arr.on('add', function(v, i) {
        switch (calls++) {
          case 0:
            assert('hi' === v);
            assert(0 === i);
            break;
          case 1:
            assert('world' === v);
            assert(1 === i);
            break;
        }
      });
      var changeCalled = 0;
      arr.on('change', function () {
        changeCalled++;
      });
      arr.unshift('hi', 'world');
      assert(changeCalled === 1);
    });
  });

  describe('splice', function () {
    it('should emit "add", "remove" and "change" events', function () {
      arr.push('1', '2', '3', '4');
      var remcalls = 0;
      arr.on('remove', function(v, i) {
        switch (remcalls++) {
          case 0:
            assert('2' === v);
            assert(1 === i);
            break;
          case 1:
            assert('3' === v);
            assert(1 === i);
            break;
        }
      });
      var addcalls = 0;
      arr.on('add', function(v, i) {
        switch (addcalls++) {
          case 0:
            assert('2.' === v);
            assert(1 === i);
            break;
          case 1:
            assert('3.' === v);
            assert(2 === i);
            break;
        }
      });
      var changeCalled = 0;
      arr.on('change', function () {
        changeCalled++;
      });
      arr.splice(1, 2, '2.', '3.');
      assert(changeCalled === 1);
    });
  });

  describe('reverse', function () {
    it('should emit a `reverse` and `change` event', function () {
      arr.push('1', '2', '3', '4');
      var called = false;
      arr.on('reverse', function () {
        called = true;
        assert(arr[0] === '4');
        assert(arr[3] === '1');
      });
      var changeCalled = false;
      arr.on('change', function () {
        changeCalled = true;
      });
      arr.reverse();
      assert(called === true);
      assert(changeCalled === true);
    });
  });

  describe('sort', function () {
    it('should emit a `sort` and `change` event', function () {
      arr.push(4, 2, 1, 2, 3);
      var called = false;
      arr.on('sort', function () {
        called = true;
        assert(arr[0] === 1);
        assert(arr[4] === 4);
      });
      var changeCalled = false;
      arr.on('change', function () {
        changeCalled = true;
      });
      arr.sort();
      assert(called === true);
      assert(changeCalled === true);
    });
  });

  describe('toString', function() {
    it('should look just like a real array', function() {
      var orig = [1, 2, 3, 4],
          arr = array(orig);

      arr = arr.toString();
      assert('string' == typeof arr);
      assert(arr === orig.toString());
    });
  });

  describe('toArray', function() {
    it('should create a real array out of array object', function(){
      var orig = [ 3, 4, 6, 2 ],
          arr = array(orig);

      arr = arr.toArray();
      assert(Array.isArray(arr));
      assert(JSON.stringify(orig) === JSON.stringify(arr));
    });
  });

  describe('toJSON', function() {
    it('should return a JSON representation of the array', function(){
      var orig = [{a: 'abc', b: 123}, {a: 'def', b: 456}],
          arr = array(orig);
      arr = arr.toArray();
      assert(Array.isArray(arr));
      assert(JSON.stringify(orig) === JSON.stringify(arr));
    });

    it('should call toJSON on objects if possible', function() {
      var orig = [{a: 'abc', toJSON: function() { return "Hello" }},
                  {a: 'abc', toJSON: function() { return "World" }}],
          arr = array(orig);

      arr = arr.toJSON();
      assert(Array.isArray(arr));
      assert(JSON.stringify(["Hello", "World"]) === JSON.stringify(arr));
    });
  });

  describe('array.get', function() {
    it ('custom getter', function() {
      var nums = array([ { n: 1 }, { n: 3 }, { n: 5}, { n: 8}, { n: 20 } ]);
      nums.get = function(obj) {
        return obj.n;
      };

      var out = nums.filter('> 4');
      assert(3 == out.length);
      assert(5 == out[0].n);
      assert(8 == out[1].n);
      assert(20 == out[2].n);
    });
  });
});
