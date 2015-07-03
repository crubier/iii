var _ = require('lodash');

// get the list of all interaction operators in an interaction expression
function listOfInteractions(theInteraction) {
  switch (theInteraction.type) {
    case "InteractionSimple":
      var res = [theInteraction.operator];
      var i;
      for (i=0;i<theInteraction.operand.length;i++){
        res = _.union(res,listOfInteractions(theInteraction.operand[i]));
      }
      return res;
    default:
      throw "Trying to get the list of interactions of something which is not an interaction expression";
  }
}

// instantiate an interaction (expand this interaction) using definitions from a matrix, prioritizing definitions in the begining of the list
function instantiate(interaction,interactionDefinitionList) {

}

function findMatchingDefinition(interaction,interactionDefinitionList) {
  var i;
  var j;
  for(i=0;i<interactionDefinitionList.length;i++) {
    for(j=0;j<interactionDefinitionList.length;j++) {
      interactionDefinitionList[0](interaction.operator);
    }
  }

}


function isBaseInteraction(interaction) {
 switch (interaction.operator) {
  case "previous$":

     break;
  case "previous$":

     break;
   default:

 }
}



module.exports.listOfInteractions = listOfInteractions;
