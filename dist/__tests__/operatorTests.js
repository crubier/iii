jest.dontMock('../operator.js').dontMock('../parser.js').dontMock('lodash');


var operator = require('../operator.js');
// var parser = require('../parser.js');
var _ = require('lodash');



describe('operator', function() {

  describe('previous', function() {

    it('should detect previous', function() {
      expect(operator.parse("previous$")).toEqual("Previous");
    });

  });

  describe('composition', function() {

    it('should detect composition with commas ', function() {
      expect(operator.parse("{x:$,y:$,}")).toEqual("Composition");
    });

    it('should detect composition without commas', function() {
      expect(operator.parse("{x:$y:$}")).toEqual("Composition");
    });

    it('should detect composition with mixed commas ', function() {
      expect(operator.parse("{bobie:$,joe:$,lol:$wow:$}")).toEqual("Composition");
    });

    it('should invalidate composition with invalid keys ', function() {
  expect(operator.parse("{bobie:$,Joe:$,lol:$wow:$}")).toEqual("Custom");
});

  });

  describe('selection', function() {

  it('should detect selection', function() {
    expect(operator.parse("$.waouh")).toEqual("Selection");
  });

  it('should detect selection with a number as key', function() {
    expect(operator.parse("$.1")).toEqual("Selection");
  });

  it('should invalidate selection with an invalid key', function() {
  expect(operator.parse("$.Lolie")).toEqual("Custom");
});

});

});
