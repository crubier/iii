var _ = require('lodash');
var operator = require('./operator.js');
var serializer = require('./serializer.js');
// var CircularJSON = require('circular-json');
var stringify = require('json-stringify-safe');

// get the list of all interaction operators in an interaction expression
function listOfInteractions(theInteraction) {
  switch (theInteraction.type) {
    case "InteractionSimple":
      var res = [theInteraction.operator];
      var i;
      for (i = 0; i < theInteraction.operand.length; i++) {
        res = _.union(res, listOfInteractions(theInteraction.operand[i]));
      }
      return res;
    default:
      throw "Trying to get the list of interactions of something which is not an interaction expression";
  }
}

// Fully expand an interaction definition into a composition of base interactions
function expand(interactionDefinition) {

  var definitions = _.map(interactionDefinition.definitions, expand);

  var interactionDefinitionWithChildrenExpanded = {
    type: "Definition",
    interaction: interactionDefinition.interaction,
    signature: interactionDefinition.signature,
    definitions: definitions,
    parent: interactionDefinition.parent
  };

  var interaction = interactionDefinition.interaction;

  var interactionsToExpandAlongWithTheirMatchingDefinition;

  do {
    interactionsToExpandAlongWithTheirMatchingDefinition =
      _.filter(
        _.map(listNonBaseInteractions(interaction),
          function(x) {
            return {
              interaction: x,
              definition: findMatchingDefinition(x, interactionDefinitionWithChildrenExpanded)
            };
          }),
        function(y) {
          return !isDefinitionOfAnArgument(y.definition);
        });

    // For each of these interactions to expand, we instatiate them
    _.forEach(interactionsToExpandAlongWithTheirMatchingDefinition, function(x) {
      interaction = instantiate(interaction, x.definition);
    });
  } while (interactionsToExpandAlongWithTheirMatchingDefinition.length > 0);

  return {
    type: "Definition",
    interaction: interaction,
    signature: interactionDefinition.signature,
    definitions: definitions,
    parent: interactionDefinition.parent
  };
}



// instantiate an interaction (expand this interaction) using a single definition
function instantiate(interaction, interactionDefinition) {
  // If the definition states that
  if(isDefinitionOfAnArgument(interactionDefinition)){
    return interaction;
  }

  // First we instantiate the operands
  var instantiatedOperands = _.map(interaction.operand, function(x) {
    return instantiate(x, interactionDefinition);
  });


  // Do we substitute this interaction or not ?
  if (interactionMatchesDefinition(interaction, interactionDefinition)) {
    return _.reduce(
      _.zip(interactionDefinition.signature.operand, instantiatedOperands),
      function(accumulator, value, key, collection) {
        return substituteInInteraction(accumulator, {
          type: "InteractionSimple",
          operator: value[0].name,
          operand: []
        }, value[1]);
      }, _.cloneDeep(interactionDefinition.interaction));
  } else {
    return {
      type: "InteractionSimple",
      operator: interaction.operator,
      operand: instantiatedOperands
    };
  }
}


// Finds the definition that matches an interaction, in the context of an interaction definition
function findMatchingDefinition(interaction, interactionDefinition) {

  // First case : No definition
  if (interactionDefinition == undefined) {
    throw new Error("could not find definition matching interaction " + serializer.serialize(interaction));
  }

  // Second case : The interaction definition specifies that it is an argument (not really possible ?)
  if(isDefinitionOfAnArgument(interactionDefinition)){
    return "Argument";
  }

  // Third case : The interaction is an argument of the definition
  if (_.any(interactionDefinition.signature.operand, "name", interaction.operator)) {
    // return {type:'Definition',interaction:"Argument",signature:{operand:[{"name":interaction.operator}]}}; /* TODO precise this return value*/
    return "Argument"; /* TODO problem is here !*/
  }


  // Fourth case : The interaction is defined within the sub definitions of the definition
  for (var i = 0; i < interactionDefinition.definitions.length; i++) {
    if (interactionMatchesDefinition(interaction, interactionDefinition.definitions[i])) {
      return interactionDefinition.definitions[i];
    }
  }

  // Fifth case: The interaction is defined in the context of the parent definition (the definition is a sub definition of its parent)
  return findMatchingDefinition(interaction, interactionDefinition.parent);
}




// Checks if an interaction definition states that an interaction is an argument
function isDefinitionOfAnArgument(definition){
  // {type:'Definition',interaction:interaction,signature:{type:'Signature',interface:interface,operator:temp.operator,operand:temp.operand},definitions:(definitions===null?[]:definitions)};
  return definition==="Argument";

}





// Check if an interaction matches an InteractionDefinition, simple for the moment, will get more complicated later
function interactionMatchesDefinition(interaction, interactiondefinition) {
  if(isDefinitionOfAnArgument(interactiondefinition))return true;
  return interaction.operator === interactiondefinition.signature.operator;
}




// Compare two interactions, returns 0 if they are equal
function compare(a, b) {
  if (a.operator > b.operator) {
    return 1;
  } else {
    if (a.operator < b.operator) {
      return -1;
    } else {
      if ((a.operand.length - b.operand.length) !== 0) {
        return (a.operand.length - b.operand.length);
      } else {
        var x = _.zip(a.operand, b.operand);
        var f = _.spread(compare);
        for (var i = 0; i < x.length; i++) {
          var res = f(x[i]);
          if (res !== 0) return res;
        }
        return 0;
      }
    }
  }
}

// Substitute a target interaction with another one in an interaction expression
function substituteInInteraction(theInteraction, target, substitute) {
  if (compare(theInteraction, target) === 0) {
    return _.cloneDeep(substitute);
  } else {
    return {
      type: theInteraction.type,
      operator: theInteraction.operator,
      operand: _.map(theInteraction.operand, function(x) {
        return substituteInInteraction(x, target, substitute);
      })
    };
  }
}




// Checks if a given interaction is made of only base interactions
function isOnlyMadeOfBaseInteractions(interaction) {
  if (!isBaseInteraction(interaction)) {
    return false;
  } else {
    return _.every(interaction.operand, isOnlyMadeOfBaseInteractions);
  }
}



// Gives a list of non base interactions in an interaction expression
function listNonBaseInteractions(interaction) {
  return (isBaseInteraction(interaction) ? [] : [interaction]).concat(_.flatten(interaction.operand.map(listNonBaseInteractions)));
}

// Checks if a given interaction is a base interaction
function isBaseInteraction(interaction) {
  var theOperator = operator.parse(interaction.operator);
  switch (theOperator) {
    case "Composition":
    case "Selection":
    case "Previous":
    case "FunctionApplication":
    case "Identifier":
      return true;
    case "Custom":
      return false;
    default:
      throw new Error('problem parsing interaction operator ' + theOperator);
  }
}



module.exports.listOfInteractions = listOfInteractions;
module.exports.isBaseInteraction = isBaseInteraction;
module.exports.isOnlyMadeOfBaseInteractions = isOnlyMadeOfBaseInteractions;
module.exports.compare = compare;
module.exports.substituteInInteraction = substituteInInteraction;
module.exports.instantiate = instantiate;
module.exports.interactionMatchesDefinition = interactionMatchesDefinition;
module.exports.expand = expand;
module.exports.findMatchingDefinition = findMatchingDefinition;
module.exports.listNonBaseInteractions = listNonBaseInteractions;
