jest.dontMock('../interactions.js').dontMock('../parser.js').dontMock('lodash');



var interactions = require('../interactions.js');
var parser = require('../parser.js');
var _ = require('lodash');

describe('interactions', function() {

  describe('list of interactions', function() {

    it('simple', function() {
      expect(interactions.listOfInteractions(
        parser.parse("(a)", {
          startRule: "interaction"
        }))).toEqual(
        ["a"]
      );
    });

    it('composite', function() {
      expect(_.sortBy(interactions.listOfInteractions(
        parser.parse("({a:(x),b:((y)+(5))})", {
          startRule: "interaction"
        })))).toEqual(
        _.sortBy(["x", "y", "5", "$+$", "{a:$,b:$}"])
      );
    });
  });
});
