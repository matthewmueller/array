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

  describe('pop', function () {
    it('should pop() like [].pop()', function () {
      arr.push('1', '2');
      var val = arr.pop();
      assert('2' === val);
      assert('1' === arr[0]);
      assert(1 === arr.length);
    });

    it('should emit "remove" events', function() {
      arr.push('1', '2');
      arr.on('remove', function(v) { assert('2' === v); });
      arr.pop();
    });
  });

  describe('push', function () {
    it('should push() like [].push()', function(){
      arr.push('1', '2');
      assert(2 === arr.length);
    });

    it('should emit "add" events', function(){
      arr.on('add', function(v) { assert('hi' === v); });
      arr.push('hi');
    });
  });
});
