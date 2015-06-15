var _ = require('lodash');

// Lodash polyfill for object array intersection
function intersectionObjects2(a, b, areEqualFunction) {
    var results = [];

    for(var i = 0; i < a.length; i++) {
        var aElement = a[i];
        var existsInB = _.any(b, function(bElement) { return areEqualFunction(bElement, aElement); });
        if(existsInB) {
            results.push(aElement);
        }
    }

    return results;
}

_.intersectionObjects = function() {
    var results = arguments[0];
    var lastArgument = arguments[arguments.length - 1];
    var arrayCount = arguments.length;
    var areEqualFunction = _.isEqual;
    if(typeof lastArgument === "function") {
        areEqualFunction = lastArgument;
        arrayCount--;
    }
    for(var i = 1; i < arrayCount ; i++) {
        var array = arguments[i];
        results = intersectionObjects2(results, array, areEqualFunction);
        if(results.length === 0) break;
    }
    return results;
};
////////////////////////////////////////////////////////////////////

var isValidType = function(theType) {
  if (theType.hasOwnProperty("type")) {
    switch (theType.type) {
      case "TypeAtomic":
        return theType.hasOwnProperty("name");
      case "TypeArray":
        return theType.hasOwnProperty("element")?isValidType(theType.element):false;
      case "TypeComposite":
        return theType.hasOwnProperty("element")?(_.every(_.map(theType.element,"value"),isValidType)):false;
      case "TypeFunction":
        return theType.hasOwnProperty("domain")?(isValidType(theType.domain) && (theType.hasOwnProperty("codomain")?isValidType(theType.codomain):false)):false;
      case "TypeOperation":
        // return theType.hasOwnProperty("operand")?(_.every(_.map(theType.operand,function(x){console.log(x);return _.map(x.element,function(y){console.log(y);return computeType(y.value);});})),isValidType):false;
        return theType.hasOwnProperty("operand")?isValidType(computeType(theType)):false;
      default:
        return false;
    }
  } else {
    return false;
  }
};

var computeType = function(theType) {
  if(theType.type==="TypeOperation") {
    switch  (theType.operator) {
      case 'union' :
        if(_.every(theType.operand,"type","TypeComposite")) {
          return {
            type:"TypeComposite",
            element:_.sortBy(_.unique(_.union.apply(null,_.map(theType.operand,"element")),"key"),"key")
          };
        }
        else {
          throw new Error("Arguments of the union type operator can only be composite types");
        }
        break;
      case 'intersection':
        if(_.every(theType.operand,"type","TypeComposite")) {
          return {
            type:"TypeComposite",
            element:_.sortBy(_.unique(_.intersection.apply(null,_.map(theType.operand,"element")),"key"),"key")
          };
        }
        else {
          throw new Error("Arguments of the union type operator can only be composite types");
        }
        break;
      case 'complement':
        //TODO
        break;
      default:
        throw new Error("Unknown type operator");
    }
  }
  return type;
};


var compareType = function(type1, type2) {
  switch (type1.type + type2.type) {
    case "TypeAtomicTypeAtomic":
      // Compare the name
      return type1.name === type2.name;
    case "TypeArrayTypeArray":
      // Compare the type of the array elements
      return compareType(type1.element, type2.element);
    case "TypeCompositeTypeComposite":
      // Compare the set of keys
      if(_.isEmpty(_.xor(_.map(type1.element,"key"), _.map(type2.element,"key")))) {
        // If same set of keys, compare type of elements
        return _.reduce(
          _.zip(_.sortBy(type1.element,"key"),_.sortBy(type2.element,"key")),
          function(result,element,n){
            return result && compareType(element[0].value,element[1].value);
          },
          true
        );
      } else {
        return false;
      }
      break;
    case "TypeFunctionTypeFunction":
      return compareType(type1.codomain, type2.codomain) && compareType(type1.domain, type2.domain);
    default:
      if(type1.type === "TypeOperation" || type2.type === "TypeOperation"){
        return compareType(computeType(type1), computeType(type2));
      }
      else {
        return false;
      }
  }
};


module.exports = {
  compare:compareType,
  compute:computeType,
  isValid:isValidType
};
