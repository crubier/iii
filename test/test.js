

var assert = require("assert");

var fs = require('fs');

var Parser = require('../lib/parser.js');

var Compiler = require('../lib/compiler.js');

var HexastoreBasedParser = require('../lib/HexastoreBasedParser.js');

var testExpression = fs.readFileSync('example/example1.iii',{encoding:'utf8'});

describe('Parser',function(){

  var parsed;

    describe('parsing',function(){
    it('parse the test expression',function(){
      assert.doesNotThrow(function(){
        parsed=Parser.parse(testExpression);
      });
    });
    it('return an array of interactions',function(){
      assert.equal(true,parsed instanceof Array);
    });
  });
    describe('names',function(){
    it('interaction name',function(){
      assert.equal('dothat$andthis$while$is$',parsed[0].name);
    });
    it('long argument name with number',function(){
      assert.equal('thing34',parsed[0].args[1].name);
    });
    it('long argument name',function(){
      assert.equal('bobie',parsed[0].args[0].name);
    });
    it('short argument name',function(){
      assert.equal('a',parsed[0].args[2].name);
    });
    it('short argument name',function(){
      assert.equal('b',parsed[0].args[3].name);
    });
  });
    describe('types',function(){
    it('interaction base type',function(){
      assert.equal('void',parsed[0].type.datatype.base);
    });
    it('argument base type',function(){
      assert.equal('number',parsed[0].args[1].type.datatype.base);
    });
    it('argument generic type',function(){
      assert.equal('type1',parsed[0].args[0].type.datatype.generic);
    });
    it('argument tuple type',function(){
      assert.equal('number',parsed[0].args[2].type.datatype.tuple[0].base);
      assert.equal('void',parsed[0].args[2].type.datatype.tuple[1].base);
    });
    it('argument record type',function(){
      assert.equal('x',parsed[0].args[3].type.datatype.union[0].record[0].key);
      assert.equal('number',parsed[0].args[3].type.datatype.union[0].record[0].value.base);
      assert.equal('y',parsed[0].args[3].type.datatype.union[0].record[1].key);
      assert.equal('number',parsed[0].args[3].type.datatype.union[0].record[1].value.base);
      assert.equal('text',parsed[0].args[3].type.datatype.union[1].base);
    });
  });
});


describe('Compiler',function(){
  describe('compile',function(){
    it('compile the test expression',function(){
      assert.doesNotThrow(function(){
        Compiler.compile(testExpression);
      });
    });
  });
});

describe('Hexastore based parser',function(){
  describe('compile',function(){
    var store;
    it('parse the test expression',function(){
      assert.doesNotThrow(function(){
        store = HexastoreBasedParser.parse(testExpression);
      });
    });
    it('returns a correct hexastore',function(){
      assert.deepEqual([ { s: 'iii', p: 'by', o: 'crubier' } ],store.search([[['s'],['p'],['o']]]));
    });
  });
});
