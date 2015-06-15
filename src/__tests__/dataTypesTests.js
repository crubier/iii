jest.dontMock('../dataTypes').dontMock('lodash');

describe('data types', function() {
  var types = require('../dataTypes');


  describe('validation', function() {
    it('should detect invalid types', function() {

      expect(types.isValid({
        bob: "lol"
      })).toBeFalsy();

      expect(types.isValid({
        type: "Bobie"
      })).toBeFalsy();

      expect(types.isValid({
        type: "TypeAtomic"
      })).toBeFalsy();

      expect(types.isValid({
        type: "TypeComposite"
      })).toBeFalsy();

      expect(types.isValid({
        type: "TypeFunction"
      })).toBeFalsy();

      expect(types.isValid({
        type: "TypeArray"
      })).toBeFalsy();

      expect(types.isValid({
        type: "TypeOperation"
      })).toBeFalsy();
    });

    describe('valid types', function() {

      it('should detect valid atomic type', function() {
        expect(types.isValid({
          type: "TypeAtomic",
          name: "Boolean"
        })).toBeTruthy();
      });

      it('should detect valid composite type', function() {
        expect(types.isValid({
          type: "TypeComposite",
          element: [{type:"TypeCompositeElement",key:"joe",value:{
            type: "TypeAtomic",
            name: "Boolean"
          }}]
        })).toBeTruthy();
      });

      it('should detect valid function type', function() {
        expect(types.isValid({
          type: "TypeFunction",
          domain: {
            type: "TypeAtomic",
            name: "Boolean"
          },
          codomain: {
            type: "TypeAtomic",
            name: "Number"
          }
        })).toBeTruthy();
      });

      it('should detect valid array type', function() {
        expect(types.isValid({
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Text"
          }
        })).toBeTruthy();
      });

//TODO
      it('should detect valid operation type', function() {
        expect(types.isValid({
          type: "TypeOperation",
          operator: 'union',
          operand: [
            {
              type: "TypeComposite",
              element: [{type:"TypeCompositeElement",key:"joe",value:{
                type: "TypeAtomic",
                name: "Boolean"
              }}]
            },
            {
              type: "TypeComposite",
              element: [{type:"TypeCompositeElement",key:"bob",value:{
                type: "TypeAtomic",
                name: "Number"
              }}]
            }
          ]
        })).toBeTruthy();
      });

//TODO
      // it('should prevent invalid operation type', function() {
      //   expect(types.isValid({
      //     type: "TypeOperation",
      //     operator: 'union',
      //     operand: [{
      //       type: "TypeAtomic",
      //       name: "Boolean"
      //     }]
      //   })).toBeFalsy();
      // });


    });
  });


  describe('compare', function() {

    describe('mixed types', function() {
      it('should detect difference', function() {
        expect(types.compare({
          type: "TypeAtomic",
          name: "Number"
        }, {
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Boolean"
          }
        })).toBeFalsy();
      });

    });

    describe('atomic', function() {
      it('should detect equality', function() {
        expect(types.compare({
          type: "TypeAtomic",
          name: "Number"
        }, {
          type: "TypeAtomic",
          name: "Number"
        })).toBeTruthy();
      });
      it('should detect difference', function() {
        expect(types.compare({
          type: "TypeAtomic",
          name: "Number"
        }, {
          type: "TypeAtomic",
          name: "Text"
        })).toBeFalsy();
      });
    });

    describe('array', function() {
      it('should detect equality', function() {
        expect(types.compare({
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Boolean"
          }
        }, {
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Boolean"
          }
        })).toBeTruthy();
      });
      it('should detect difference', function() {
        expect(types.compare({
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Activation"
          }
        }, {
          type: "TypeArray",
          element: {
            type: "TypeAtomic",
            name: "Boolean"
          }
        })).toBeFalsy();
      });
    });

    describe('function', function() {
      it('should detect equality', function() {
        expect(types.compare({
          type: "TypeFunction",
          domain: {
            type: "TypeAtomic",
            name: "Boolean"
          },
          codomain: {
            type: "TypeAtomic",
            name: "Number"
          }
        }, {
          type: "TypeFunction",
          domain: {
            type: "TypeAtomic",
            name: "Boolean"
          },
          codomain: {
            type: "TypeAtomic",
            name: "Number"
          }
        })).toBeTruthy();
      });
      it('should detect difference', function() {
        expect(types.compare({
          type: "TypeFunction",
          domain: {
            type: "TypeAtomic",
            name: "Boolean"
          },
          codomain: {
            type: "TypeAtomic",
            name: "Number"
          }
        }, {
          type: "TypeFunction",
          domain: {
            type: "TypeAtomic",
            name: "Number"
          },
          codomain: {
            type: "TypeAtomic",
            name: "Number"
          }
        })).toBeFalsy();
      });
    });

    describe('composite', function() {
      it('should detect equality in a simple case', function() {
        expect(types.compare({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        }, {
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        })).toBeTruthy();
      });
      it('should detect equality even if keys are in a different order', function() {
        expect(types.compare({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        }, {
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }, {
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }]
        })).toBeTruthy();
      });
      it('should detect difference in types', function() {
        expect(types.compare({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }]
        }, {
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        })).toBeFalsy();
      });

      it('should detect difference in keys', function() {
        expect(types.compare({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        }, {
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        })).toBeFalsy();
      });

    });


  });


  describe('compute', function() {
    describe('union', function() {

      it('should work in a simple case', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "union",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        });
      });

      it('should output a composite type where keys are sorted lexicographically', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "union",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        });
      });

      it('should pick elements from the first operand when operands have identical keys with different types', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "union",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Text"
              }
            }, {
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        });
      });

    });


    describe('intersection', function() {

      it('should work in a simple case', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "intersection",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            },
            {
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }]
        });
      });

      it('should output a composite type where keys are sorted lexicographically', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "union",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        });
      });

      it('should pick elements from the first operand when operands have identical keys with different types', function() {
        expect(types.compute({
          type: "TypeOperation",
          operator: "union",
          operand: [{
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Boolean"
              }
            }]
          }, {
            type: "TypeComposite",
            element: [{
              type: "TypeCompositeElement",
              key: "XYZ",
              value: {
                type: "TypeAtomic",
                name: "Text"
              }
            }, {
              type: "TypeCompositeElement",
              key: "ABC",
              value: {
                type: "TypeAtomic",
                name: "Number"
              }
            }]
          }]
        })).toEqual({
          type: "TypeComposite",
          element: [{
            type: "TypeCompositeElement",
            key: "ABC",
            value: {
              type: "TypeAtomic",
              name: "Number"
            }
          }, {
            type: "TypeCompositeElement",
            key: "XYZ",
            value: {
              type: "TypeAtomic",
              name: "Boolean"
            }
          }]
        });
      });

    });



  });
});
