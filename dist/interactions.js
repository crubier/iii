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

// instantiate an interaction definition (expand this interaction) in an interaction expression
function instantiate(interactionDefinition,interaction) {
  //TODO
}

module.exports.listOfInteractions = listOfInteractions;
