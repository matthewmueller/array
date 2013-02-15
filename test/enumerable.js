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
       var fruit = fruits.find({ name : 'grape'});
       assert('grape' == fruit.name);
    });

    it('should work with functions', function(){
      var fruit = fruits.find(function(fruit) {
        return fruit.name == 'grape';
      });
      assert('grape' == fruit.name);
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
});
