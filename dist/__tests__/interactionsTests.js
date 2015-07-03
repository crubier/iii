jest.dontMock('../interactions.js').dontMock('../parser.js').dontMock('../operator.js').dontMock('lodash');



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

  describe('is base interaction', function() {

    it('simple', function() {
      // console.log(JSON.stringify(parser.parse("(previous(q))", {startRule: "interaction"}).operator));

      expect(interactions.isBaseInteraction(
        parser.parse("(previous(q))", {
          startRule: "interaction"
        }))).toEqual(
        true
      );
    });

  });

  describe('is made of base interactions', function() {

    it('case 1', function() {

      expect(interactions.isOnlyMadeOfBaseInteractions(
        parser.parse("(previous(#))", {
          startRule: "interaction"
        }))).toEqual(
        true
      );
    });

    it('case 2 with the custom interaction (5)', function() {

      expect(interactions.isOnlyMadeOfBaseInteractions(
        parser.parse("(previous(#(5)))", {
          startRule: "interaction"
        }))).toEqual(
        false
      );
    });

    it('case 3', function() {
      expect(interactions.isOnlyMadeOfBaseInteractions(
        parser.parse("(previous(#(#5)))", {
          startRule: "interaction"
        }))).toEqual(
        true
      );
    });


    it('case 4 with all base interactions', function() {
      expect(interactions.isOnlyMadeOfBaseInteractions(
        parser.parse("({a:(previous(#(#5)))b:((#d).xys)c:((#2)in(#5)(#2)=(#(#5)))})", {
          startRule: "interaction"
        }))).toEqual(
        true
      );
    });

  });




  describe('compare', function() {

    it('case 1', function() {
      expect(interactions.compare(
        parser.parse("(previous(#))", {
          startRule: "interaction"
        }),
        parser.parse("(previous(#))", {
          startRule: "interaction"
        })) === 0).toBeTruthy();
    });

    it('case 2', function() {
      expect(interactions.compare(
        parser.parse("(previous(#))", {
          startRule: "interaction"
        }),
        parser.parse("(previous(#lol))", {
          startRule: "interaction"
        })) !== 0).toBeTruthy();
    });

    it('case 3', function() {
      expect(interactions.compare(
        parser.parse("(previous(#(5)(6)))", {
          startRule: "interaction"
        }),
        parser.parse("(previous(#(5)(7)))", {
          startRule: "interaction"
        })) !== 0).toBeTruthy();
    });

    it('case 4', function() {
      expect(interactions.compare(
        parser.parse("(previous(#(5)(6)))", {
          startRule: "interaction"
        }),
        parser.parse("(precious(#(5)(7)))", {
          startRule: "interaction"
        })) !== 0).toBeTruthy();
    });


  });



  describe('substitute in interaction', function() {

  //TODO


  });

});
