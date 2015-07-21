
serializer = require('./serializer.js');
identifiers = require('./identifiers.js');
interactions = require('./interactions.js');
parser = require('./parser.js');

function compileToIii(source){
  return serializer.serialize(
          identifiers.reduceIdentifiers(
            interactions.expand(
              parser.parse(
                source
              )[0]
            ).interaction
          )
        );
}


module.exports.compileToIii = compileToIii;
