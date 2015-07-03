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


function isOnlyMadeOfBaseInteractions(interaction) {
  if(!isBaseInteraction(interaction)) {
    return false;
  } else {
    var i;
    for(i=0;i<interaction.operand.length;i++) {
      if(!isOnlyMadeOfBaseInteractions(interaction.operand[i])) {
        return false;
      }
    }
    return true;
  }
}

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
      throw new Error ('problem parsing interaction operator '+theOperator);
  }
}



module.exports.listOfInteractions = listOfInteractions;
module.exports.isBaseInteraction = isBaseInteraction;
module.exports.isOnlyMadeOfBaseInteractions = isOnlyMadeOfBaseInteractions;
