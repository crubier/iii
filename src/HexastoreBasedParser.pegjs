{
  var Hexastore = require('Hexastore');

  var store = new Hexastore();

  function mergeExpression(elements) {
    var res = {operator:"",operand:[]};
    for(var i=0;i<elements.length;i++) {
      if( elements[i].operand!==undefined && elements[i].operand!==null ) {
        res.operand.push(elements[i].operand);
        res.operator = res.operator + "$";
      }
      if( elements[i].operator!==undefined && elements[i].operator!==null ) {
        res.operator = res.operator + elements[i].operator;
      }
    }
    return res;
  }

  function mergeDefinition(elements) {
    var res = {operator:"",operand:[]};
    for(var i=0;i<elements.length;i++) {
      if( elements[i].operand!==undefined && elements[i].operand!==null ) {
        res.operand.push(elements[i].operand);
        res.operator = res.operator + "$";
      }
      if( elements[i].operator!==undefined && elements[i].operator!==null ) {
        res.operator = res.operator + elements[i].operator;
      }
    }
    return res;
  }

  function mergeElements(first,rest) {
    var res=[];
    if(rest!==undefined && rest!==null){
      res=rest;
    }
    res.unshift(first);
    return res;
  }
}



// High level elements

start
= _ definitions:definition* _ {store.put(['iii','by','crubier']);return store;}

definition "definition"
=  "("  elements:definitionelement* _ ")" _ ":" _ type:type  _ "=" _ interaction:expression  _
{ var temp = mergeDefinition(elements); return {type:type,name:temp.operator,args:temp.operand,interaction:interaction};}

definitionelement "definition element"
= _ operator:operatoridentifier {return {operator:operator};}
/ _ "(" _ name:variableidentifier _":"_ type:type _ ")" {return {operand:{type:type,name:name}};}




// Type expressions
type "type"
= datatype:datatype _ direction:direction {return {datatype:datatype,direction:direction};}

datatype "data type"
= base:("text"/"number"/"boolean"/"void") {return {base:base};}
/ name:typeidentifier {return {custom:name}}
/ "<" _ generic:typeidentifier _ ">" {return {generic:generic};}
/ "(" _ first:datatype _ rest:("," _ content:datatype _ {return content;})* ")" {return {tuple:mergeElements(first,rest)};}
/ "[" _ first:datatype _ rest:("," _ content:datatype _ {return content;})* "]" {return {array:mergeElements(first,rest)};}
/ "|" _ first:datatype _ rest:("," _ content:datatype _ {return content;})* "|" {return {union:mergeElements(first,rest)};}
/ "{" _ first:(key:keyidentifier _ ":" _ value:datatype {return {key:key,value:value}}) _ rest:("," _ content:(key:keyidentifier _ ":" _ value:datatype {return {key:key,value:value}}) _ {return content;})* "}" {return {record:mergeElements(first,rest)};}

direction "direction of a data flow"
= val:("out" / "in") {return val;}






// Interaction expressions

expression "expression"
= "(" elements:expressionelement* _ ")" {return mergeExpression(elements);}

expressionelement "expression element"
= _ operand:expression {return {operand:operand};}
/ _ operator:operatoridentifier {return {operator:operator};}





// Leaves of the AST

operatoridentifier "operator identifier"
= val:[^ \t\r\n$_\(\)\{\}\[\]\.]+ { return val.join(""); }

typeidentifier "type identifier"
= first:[a-zA-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(""); }

variableidentifier "variable identifier"
= first:[a-zA-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(""); }

keyidentifier "record key identifier"
= first:[a-zA-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(""); }

_ "white space"
= [ \t\r\n]*
