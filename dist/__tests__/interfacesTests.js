jest.dontMock('../interfaces.js').dontMock('../../dist/parser.js').dontMock('lodash');

var interfaces= require('../interfaces.js');
var parser = require('../../dist/parser.js');

describe('interfaces', function() {
  var interfaces = require('../interfaces');

  describe('conjugate', function() {

    it('atomic', function() {
      expect(interfaces.conjugate({
        type: 'InterfaceAtomic',
        datatype: {
          type: "TypeNamed",
          name: "Number"
        },
        direction: "out"
      })).toEqual({
        type: 'InterfaceAtomic',
        datatype: {
          type: "TypeNamed",
          name: "Number"
        },
        direction: "in"
      });
    });

    it('composite', function() {
      expect(interfaces.conjugate({
        type: 'InterfaceComposite',
        component: [{
          type: "InterfaceCompositeField",
          key: "x",
          value: {
            type: 'InterfaceAtomic',
            datatype: {
              type: "TypeNamed",
              name: "Number"
            },
            direction: "out"
          }
        }, {
          type: "InterfaceCompositeField",
          key: "y",
          value: {
            type: 'InterfaceAtomic',
            datatype: {
              type: "TypeNamed",
              name: "Text"
            },
            direction: "in"
          }
        }]
      })).toEqual({
        type: 'InterfaceComposite',
        component: [{
          type: "InterfaceCompositeField",
          key: "x",
          value: {
            type: 'InterfaceAtomic',
            datatype: {
              type: "TypeNamed",
              name: "Number"
            },
            direction: "in"
          }
        }, {
          type: "InterfaceCompositeField",
          key: "y",
          value: {
            type: 'InterfaceAtomic',
            datatype: {
              type: "TypeNamed",
              name: "Text"
            },
            direction: "out"
          }
        }]
      });
    });

  });

  it('atom list', function() {
  var code = "Number in";
  expect(interfaces.listOfAtoms(
    parser.parse(code,{startRule:"interface"}),"main")
    ).toEqual(
      [{name:"main",data:{type:"DataAtomic",name:"Number"},direction:"in"}]
    );
});

});
