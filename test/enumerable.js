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
  var views;

  beforeEach(function() {
    fruits = array(fixture);
    views = array(fixture).map(function(fruit) {
      return { model: fruit };
    });

    views.get = function(obj) {
      return obj.model;
    };
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

    it('should not change the original array', function () {
      var names = fruits.map(function(fruit) {
        return fruit.name;
      });

      assert('apple' === fruits[0].name);
      assert('pear'  === fruits[1].name);
      assert('grape' === fruits[2].name);
    });

    it('should work with strings too', function(){
       var names = fruits.map('name');
       assert('apple' === names[0]);
       assert('pear' === names[1]);
       assert('grape' === names[2]);
       assert(names instanceof array);
    });

    it('should work with a custom array.get', function() {
      var names = views.map('name');
      assert(3 == names.length);
      assert('apple' == names[0]);
      assert('pear' == names[1]);
      assert('grape' == names[2]);
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

    it('should chain without losing context', function() {

      function List(obj) {
        for(key in List.prototype) {
          obj[key] = List.prototype[key];
        }
      }

      array(List.prototype);
      List.prototype.get = function(o) { return o; };

      function ListView() {}
      List(ListView.prototype);
      ListView.prototype.hide = function() { return 'hidden'; };

      var list = new ListView();
      list.push(1, 2, 3, 4);

      assert('hidden' == list.filter('> 3').hide());
    });

    it('should work with custom array.get', function() {
      var out = views.filter('calories > 50');
      assert(2 == out.length);
      assert('apple' == out[0].model.name);
      assert('pear' == out[1].model.name);
    });

    it('shouldn\'t mutate the original array', function() {
      var len = fruits.length;
      var out = fruits.filter('calories < 50');
      assert(len == fruits.length);
      assert(len > out.length);
      assert('apple' == fruits[0].name);
      assert('grape' == out[0].name);
    })
  });

  describe('unique', function() {
    it('should undupe objects', function() {
      var arr = array([1,2,4,4,4,2,1,5,0]);
      var out = arr.unique();
      assert(5 == out.length);
      assert(1 == out[0]);
      assert(2 == out[1]);
      assert(4 == out[2]);
      assert(5 == out[3]);
      assert(0 == out[4]);
    });

    it('should chain without losing context', function() {
      var obj = { name: 'matt' };
      var arr = array(obj);
      arr.push(1,2,4,4,4,2,1,5,0);
      var out = arr.unique();
      assert(5 == out.length);
      assert('matt' == out.name);
    });

    it('should uniquify based on fields', function() {
      fruits.push({ name: 'orange', calories: 100 });
      var names = fruits.unique('calories').map('name');
      assert(3 == names.length);
      assert('apple' === names[0]);
      assert('pear' === names[1]);
      assert('grape' === names[2]);
    });

    it('should work with a custom get', function() {
      views.push({ model: { name: 'orange', calories: 100 }});

      var names = views.unique('calories').map('name');
      assert(3 == names.length);
      assert('apple' === names[0]);
      assert('pear' === names[1]);
      assert('grape' === names[2]);
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

    it('should chain without losing context', function() {
      var obj = { name: 'matt' };
      var arr = array(obj);
      arr.push(1, 2, 3, 4);
      var out = arr.reject('>= 3');
      assert(2 == out.length);
      assert(1 == out[0]);
      assert(2 == out[1]);
      assert('matt' == out.name);
    });

    it('should\'t mutate the original array', function() {
      var obj = { name: 'matt' };
      var arr = array(obj);
      arr.push(1, 2, 3, 4);
      var out = arr.reject('>= 3');
      assert(4 == arr.length);
      assert(1 == arr[0]);
      assert(2 == arr[1]);
      assert(3 == arr[2]);
      assert(4 == arr[3]);
      assert('matt' == arr.name);
    });

    it('should work with a custom array.get', function() {
      var out = views.reject('calories > 50');
      assert(1 == out.length);
      assert('grape' == out[0].model.name);
    });

    it('shouldn\'t mutate the original array', function() {
      var len = fruits.length;
      var out = fruits.reject('calories > 50');
      assert(len == fruits.length);
      assert(len > out.length);
    })
  });

  describe('find', function() {
    it('should work with objects', function(){
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

    it('should work with custom get', function() {
      views.sort('calories');
      assert('grape' === views[0].model.name);
      assert('apple' === views[1].model.name);
      assert('pear' === views[2].model.name);
    })

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
