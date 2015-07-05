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

  it('case 1', function() {
    expect(
      interactions.compare(
        interactions.substituteInInteraction(
          parser.parse("(bob(joe(5)(6))and(lol))", {
            startRule: "interaction"
          }),
          parser.parse("(joe(5)(6))", {
            startRule: "interaction"
          }),
          parser.parse("(a)", {
            startRule: "interaction"
          })
        ),
        parser.parse("(bob(a)and(lol))", {
          startRule: "interaction"
        })
      ) === 0
    ).toBeTruthy();
  });

  it('case 2', function() {
    expect(
      interactions.compare(
        interactions.substituteInInteraction(
          parser.parse("(bob(joe(5)(6))and(joe(5)(6)))", {
            startRule: "interaction"
          }),
          parser.parse("(joe(5)(6))", {
            startRule: "interaction"
          }),
          parser.parse("(a)", {
            startRule: "interaction"
          })
        ),
        parser.parse("(bob(a)and(a))", {
          startRule: "interaction"
        })
      ) === 0
    ).toBeTruthy();
  });

  it('case 3', function() {
    expect(
      interactions.compare(
        interactions.substituteInInteraction(
          interactions.substituteInInteraction(
            parser.parse("(bob(x)and(y))", {
              startRule: "interaction"
            }),
            parser.parse("(x)", {
              startRule: "interaction"
            }),
            parser.parse("(lol(y))", {
              startRule: "interaction"
            })
          ),
          parser.parse("(y)", {
            startRule: "interaction"
          }),
          parser.parse("(bobie(4))", {
            startRule: "interaction"
          })
        ),
        parser.parse("(bob(lol(bobie(4)))and(bobie(4)))", {
          startRule: "interaction"
        })
      ) === 0
    ).toBeTruthy();
  });

  it('case 4', function() {
    expect(
      interactions.compare(
        interactions.substituteInInteraction(
          parser.parse("(#4(5))", {
            startRule: "interaction"
          }),
          parser.parse("(#4(5))", {
            startRule: "interaction"
          }),
          parser.parse("(#4)", {
            startRule: "interaction"
          })
        ),
        parser.parse("(#4)", {
          startRule: "interaction"
        })
      ) === 0
    ).toBeTruthy();
  });

});




describe('interaction matches definition', function() {
  it('should work', function() {
    expect(
      interactions.interactionMatchesDefinition(
        parser.parse("(test(a)(b))", {
          startRule: "interaction"
        }),
        parser.parse("interaction(test(a:X in)(b:Y out)):Z in is (bob)", {
          startRule: "interactionDefinition"
        })
      )).toBeTruthy();
  });
});



describe('instantiate in interaction', function() {

  it('should preserve interactions not matching', function() {

    expect(
      interactions.instantiate(
        parser.parse("(test(a)(b))", {
          startRule: "interaction"
        }),
        parser.parse("interaction (x):Number in is (y)", {
          startRule: "interactionDefinition"
        })
      )
    ).toEqual(parser.parse("(test(a)(b))", {
      startRule: "interaction"
    }));

  });

  // it('should instantiate a simple case with no arguments', function() {
  //   // expect(
  //   //   interactions.compare(
  //   //
  //   //     interactions.instantiate(
  //   //       parser.parse("(test(a)(b))", {
  //   //         startRule: "interaction"
  //   //       }),
  //   //       parser.parse("interaction (a):Number in is (b)", {
  //   //         startRule: "interactionDefinition"
  //   //       })
  //   //     ),
  //   //     parser.parse("(test(b)(b))", {
  //   //       startRule: "interaction"
  //   //     })
  //   //   ) === 0
  //   // ).toBeTruthy();
  //
  //   expect(
  //     interactions.instantiate(
  //       parser.parse("(test(a)(b))", {
  //         startRule: "interaction"
  //       }),
  //       parser.parse("interaction (a):Number in is (b)", {
  //         startRule: "interactionDefinition"
  //       })
  //     )
  //   ).toEqual(parser.parse("(test(b)(b))", {
  //     startRule: "interaction"
  //   }));
  //
  // });

  // it('should instantiate a case with arguments', function() {
  // expect(
  //   interactions.compare(
  //
  //   interactions.instantiate(
  //     parser.parse("(test(a(5))(b))", {
  //       startRule: "interaction"
  //     }),
  //     parser.parse("interaction (a(x:Number in)):Number out is (bob(x)test(x))", {
  //       startRule: "interactionDefinition"
  //     })
  //   ),
  //   parser.parse("(test(bob(5)test(5))(b))", {
  //     startRule: "interaction"
  //   })
  // )===0
  // ).toBeTruthy();
  // });

});



});
