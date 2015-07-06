function serialize(object) {
  switch (object.type) {
    case 'InteractionSimple':
      return serializeInteractionSimple(object);
    case 'InteractionJavascript':
      return serializeInteractionJavascript(object);
    default:
      throw new Error('Cannot serialize '+object.type);
  }
}


// Interaction
function serializeInteractionSimple(object) {
  var list = object.operator.split("$");
  var res = '(';
  res = res + list[0];
  for(var i = 1;i<list.length;i++) {
      res = res + serialize(object.operand[i-1]);
      res = res + list[i];
  }
  res = res +')';
  return res;
}

function serializeInteractionJavascript(object) {
  return "(js` /*TODO*/`)";
}

module.exports.serialize = serialize;
