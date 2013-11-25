/**
 * Module Dependencies
 */

var array = require('../'),
    assert = require('better-assert');

var fixture = [
  { name : 'apple', 'color' : 'red', 'calories' : 100 },
  { name : 'pear', 'color' : 'green', 'calories' : 200 },
  { name : 'grape', 'color' : 'purple', 'calories' : 20 }
];

describe('enumerable', function () {
  var fruits;

  beforeEach(function() {
    fruits = array(fixture);
  });

  describe('each', function () {
    it('should call a function', function () {
      var out = [];

      fruits.each(function(fruit) {
        out.push(fruit);
      });

      assert('apple' === out[0].name);
      assert('pear' === out[1].name);
      assert('grape' === out[2].name);
    });
  });

  describe('map', function () {
    it('should create a new array with ret vals', function () {
      var names = fruits.map(function(fruit) {
        return fruit.name;
      });

      assert('apple' === names[0]);
      assert('pear' === names[1]);
      assert('grape' === names[2]);
      assert(names instanceof array);
    });

    it('should work with strings too', function(){
       var names = fruits.map('name');
       assert('apple' === names[0]);
       assert('pear' === names[1]);
       assert('grape' === names[2]);
       assert(names instanceof array);
    });
  });

  describe('filter', function () {
    it('should create a new array with ret vals', function () {
      var names = fruits.filter(function(fruit) {
        return fruit.calories > 50;
      }).map('name');

      assert(2 === names.length);
      assert('apple' === names[0]);
      assert('pear' === names[1]);
      assert(names instanceof array);
    });

    it('should work with strings too', function(){
      var names = fruits.filter('calories > 50').map('name');
      assert(2 === names.length);
      assert('apple' === names[0]);
      assert('pear' === names[1]);
      assert(names instanceof array);
    });
  });

  describe('unique', function() {
    it('should undupe objects', function() {
      fruits.push({ name : 'grape', 'color' : 'purple', 'calories' : 20 });
      fruits.unique();
    });
  });

  describe('reject', function() {
    it('should reject when function is true', function() {
      var len = fruits.reject(function(fruit) {
        return fruit.name === 'apple';
      }).length;
      assert(2 == len);
    });

    it('should reject when strings are true', function() {
      fruits[0].eaten = true;
      var len = fruits.reject('eaten').length;
      assert(2 == len);
    });
  });

  describe('find', function() {
    it('should find strings', function(){
      fruits.push({ name : 'grape', color : 'red'});
      var fruit = fruits.find({ name : 'grape'});
      assert('grape' == fruit.name);
      assert('purple' == fruit.color);
    });

    it('should work with functions', function(){
      fruits.push({ name : 'grape', color : 'red'});
      var fruit = fruits.find(function(fruit) {
        return fruit.name == 'grape';
      });
      assert('grape' == fruit.name);
      assert('purple' == fruit.color);
    });
  });

  describe('findLast', function() {
    it('should find strings', function(){
      fruits.push({ name : 'grape', color : 'red'});
      var fruit = fruits.findLast({ name : 'grape'});
      assert('grape' == fruit.name);
      assert('red' == fruit.color);
    });

    it('should work with functions', function(){
      fruits.push({ name : 'grape', color : 'red' });
      var fruit = fruits.findLast(function(fruit) {
        return fruit.name == 'grape';
      });
      assert('grape' == fruit.name);
      assert('red' == fruit.color);
    });
  });

  describe('first', function() {
    it('get first n models', function(){
      var out = fruits.first(2);
      assert(2 == out.length);
    });

    it('should get first model if nothing is specified', function() {
      var out = fruits.first();
      assert('apple' == out.name);
    });

    it('should use find to handle fns', function(){
       var fruit = fruits.first({ color : 'purple' });
       assert('grape' == fruit.name);
    });
  });

  describe('last', function () {
    it('get last n models', function(){
      var out = fruits.last(2);
      assert(2 == out.length);
      assert('pear' == out[0].name);
      assert('grape' == out[1].name);
    });

    it('should get last model if nothing is specified', function() {
      var out = fruits.last();
      assert('grape' == out.name);
    });

    it('should use find to handle fns', function(){
       var fruit = fruits.last({ color : 'purple' });
       assert('grape' == fruit.name);
    });
  });

  describe('indexOf', function () {
    it('work with indexOf', function () {
      var arr = array(['1', '2']);
      assert(0 === arr.indexOf('1'));
      assert(1 === arr.indexOf('2'));
    });

    it('should also work with objects', function(){
      var i = fruits.indexOf(fruits[2]);
      assert(2 == i);
    });
  });

  describe('lastIndexOf', function () {
    it('work with lastIndexOf', function () {
      var arr = array(['1', '2']);
      assert(0 === arr.lastIndexOf('1'));
      assert(1 === arr.lastIndexOf('2'));
    });

    it('should also work with objects', function(){
      var i = fruits.lastIndexOf(fruits[2]);
      assert(2 == i);
    });
  });

  describe('hash', function () {
    it('should create hashes from an array', function () {
      var out = fruits.hash('name');
      assert(fruits[0] === out.apple);
      assert(fruits[1] === out.pear);
      assert(fruits[2] === out.grape);
    });
  });

  describe('sort', function () {
    it('should work without args and numbers', function(){
      var arr = array([4, 2, 1, 2, 3])
      arr = arr.sort();
      assert(1 === arr[0])
      assert(2 === arr[1])
      assert(2 === arr[2])
      assert(3 === arr[3])
      assert(4 === arr[4])
    });

    it('should work with functions', function () {
      fruits.sort(function(a, b) {
        if(a.calories < b.calories) return -1;
        else if(a.calories > b.calories) return 1;
        return 0
      });

      assert('grape' === fruits[0].name);
      assert('apple' === fruits[1].name);
      assert('pear' === fruits[2].name);
    });

    it('should support strings', function(){
      fruits.sort('calories')
      assert('grape' === fruits[0].name);
      assert('apple' === fruits[1].name);
      assert('pear' === fruits[2].name);
    });

    describe('descending direction', function () {
      it('should support numbers', function(){
        fruits.sort('calories', -1)
        assert('pear' === fruits[0].name);
        assert('apple' === fruits[1].name);
        assert('grape' === fruits[2].name);
      });

      it('should support shorthand string', function(){
        fruits.sort('calories', 'desc')
        assert('pear' === fruits[0].name);
        assert('apple' === fruits[1].name);
        assert('grape' === fruits[2].name);
      });

      it('should support full string', function(){
        fruits.sort('calories', 'descending')
        assert('pear' === fruits[0].name);
        assert('apple' === fruits[1].name);
        assert('grape' === fruits[2].name);
      });

      it('should support booleans', function(){
        fruits.sort('calories', false)
        assert('pear' === fruits[0].name);
        assert('apple' === fruits[1].name);
        assert('grape' === fruits[2].name);
      });
    });
  });
});
