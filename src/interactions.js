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

// instantiate an interaction (expand this interaction) using definitions from a matrix, prioritizing definitions in the begining of the list
function instantiate(interaction, interactionDefinitionList) {

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

// Compare two interaction, return 0 if they are equal
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
