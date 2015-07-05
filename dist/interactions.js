var _ = require('lodash');
var operator = require('./operator.js');

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

// fully expand an interaction definition into a composition of base interactions
function expand(interactionDefinition) {
  //TODO
}

//TODO
//ONGOING
// instantiate an interaction (expand this interaction) using definitions from a matrix, prioritizing definitions in the begining of the list
function instantiate(interaction, interactionDefinition) {

  var instantiatedOperands = _.map(interaction.operand,function(x){
      return instantiate(x,interactionDefinition);
  });

  if(interactionMatchesDefinition(interaction,interactionDefinition)) {
    // console.log("we have a match "+interaction.operator+ " "+interactionDefinition.signature.operator);
    // var expandedInteraction = expand(interactionDefinition.interaction);
    // interactionDefinition.signature.operand   and   interaction.operand    do match !

    // console.log("operands "+JSON.stringify(instantiatedOperands));
    return _.reduce(
      _.zip(  interactionDefinition.signature.operand,instantiatedOperands),
      function(accumulator, value, key, collection)  {
        var target = {type:"InteractionSimple",operator:value[0].name,operand:[]};
        var substitute = value[1];
        // console.log("substitution " + JSON.stringify([target,substitute]));
        var res = substituteInInteraction(accumulator, target, substitute);
        // console.log("result "+JSON.stringify(res));
        return res;
    }, _.cloneDeep(interactionDefinition.interaction));
  } else {
    return {
      type:"InteractionSimple",
      operator:interaction.operator,
      operand:instantiatedOperands
    };
  }
}

function computeDefinitionList(interactiondefinition) {
  //TODO
}

function findMatchingDefinition(interaction, interactionDefinitionList) {
  var i;
  var j;
  for (i = 0; i < interactionDefinitionList.length; i++) {
    for (j = 0; j < interactionDefinitionList.length; j++) {
      interactionDefinitionList[0](interaction.operator);
    }
  }
}

// Check if an interaction matches an InteractionDefinition, simple for the moment, will get more complicated later
function interactionMatchesDefinition(interaction,interactiondefinition) {
  return interaction.operator === interactiondefinition.signature.operator;
}


// Compare two interaction, returns 0 if they are equal
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
