{
  var esprima = require('esprima');
  var fs = require('fs');

  var resolver = options.resolver;

  function mergeExpression(elements) {
    var res = {operator:'',operand:[]};
    for(var i=0;i<elements.length;i++) {
      if( elements[i].operand!==undefined && elements[i].operand!==null ) {
        res.operand.push(elements[i].operand);
        res.operator = res.operator + '$';
      }
      if( elements[i].operator!==undefined && elements[i].operator!==null ) {
        res.operator = res.operator + elements[i].operator;
      }
    }
    return res;
  }

  function mergeSignature(elements) {
    var res = {operator:'',operand:[]};
    for(var i=0;i<elements.length;i++) {
      if( elements[i].operand!==undefined && elements[i].operand!==null ) {
        res.operand.push(elements[i].operand);
        res.operator = res.operator + '$';
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

  function flatten(table) {
    var res=[];
    for(var i=0;i<table.length;i++){
      res = res.concat(table[i]);
    }
    return res;
  }
}

////////////////////////////////////////////////////////////////////////////////

// High level elements
//TODO

start
= _ definitions:definitions _ {return definitions;}

definitions 'a list of definitions'
= _ content:content* _ {return flatten(content);}

content 'a definition or an import statement'
= _ definition:definition {return [definition];}
/ _ 'import' _ package:[^`]* _ {return parse(fs.readFileSync(filename.join(''),{encoding:'utf8'}));}

definition 'an interaction definition'
= _ 'interaction' _ signature:signature  _ definitions:(_ 'with' _ definitions:definitions {return definitions;})? _'is' _ interaction:interaction  _{ return {type:'Definition',interaction:interaction,signature:signature,definitions:(definitions===null?[]:definitions)};}

signature 'an interaction signature specification'
= '('  elements:signatureElement* _ ')' _ ':' _ interface:interface { var temp = mergeSignature(elements);return {type:'Signature',interface:interface,operator:temp.operator,operand:temp.operand};}

signatureElement 'a signature element'
= _ operator:operatorIdentifier {return {operator:operator};}
/ _ '(' _ name:variableIdentifier _':'_ interface:interface _ ')' {return {operand:{interface:interface,name:name}};}



////////////////////////////////////////////////////////////////////////////////
// Interface specifications

interface 'the specification of an interface'
= interfaceAtomic / interfaceComposite / interfaceOperation

interfaceOperation 'the specification of an interface using operators'
= operator:interfaceOperator _ '(' _ first:interface rest:(_',' _ content:interface {return content;})* _')' { return {type:"InterfaceOperation",operator:operator,operand:mergeElements(first,rest)}}

interfaceOperator 'an interface operator (conjugation,globalisation,localisation,reception,emission,union,intersection,complement)'
= 'conjugation' / 'globalisation' / 'localisation' / 'reception' / 'emission' / 'union' / 'intersection' / 'complement'

interfaceAtomic 'the specification of an atomic interface'
= data:data _ direction:direction {return {type:'InterfaceAtomic',data:data,direction:direction};}

interfaceComposite 'the specification of a composite interface'
= '{' _ first:(key:keyIdentifier _ ':' _ value:interface {return {type:'InterfaceCompositeElement',key:key,value:value}}) _ rest:(',' _ content:(key:keyIdentifier _ ':' _ value:interface {return {type:'InterfaceCompositeElement',key:key,value:value}}) _ {return content;})* '}' {return {type:'InterfaceComposite',element:mergeElements(first,rest)};}

////////////////////////////////////////////////////////////////////////////////
// Direction
direction 'the direction of a data flow'
= 'out' / 'in' / 'ref'

////////////////////////////////////////////////////////////////////////////////
// Data Types specifications

data 'the specification of a data type'
= dataAtomic / dataComposite / dataArray / dataFunction / dataOperation

dataOperation 'the specification of an data type using operators'
= operator:dataOperator _ '(' _ first:data rest:(_',' _ content:data {return content;})* _')' { return {type:"DataOperation",operator:operator,operand:mergeElements(first,rest)}}

dataOperator 'an data type operator (union,intersection,complement)'
= 'union' / 'intersection' / 'complement'

dataAtomic 'the specification of an atomic data type'
= name:dataIdentifier {return {type:'DataAtomic',name:name}}

dataComposite 'the specification of a composite data type'
= '{' _ first:(key:keyIdentifier _ ':' _ value:data {return {type:'DataCompositeElement',key:key,value:value}}) _ rest:(',' _ content:(key:keyIdentifier _ ':' _ value:data {return {type:'DataCompositeElement',key:key,value:value}}) _ {return content;})* '}' {return {type:'DataComposite',element:mergeElements(first,rest)};}

dataArray 'the specification of an array type'
= '[' _ element:data _ ']' {return {type:'DataArray',element:element};}

dataFunction 'the specification of a function type'
= '(' _ domain:data _ ('→'/'->') _ codomain:data _')'{return {type:'DataFunction',domain:domain,codomain:codomain};}

////////////////////////////////////////////////////////////////////////////////
// Interaction
interaction 'an interaction'
= '(' elements:interactionElement* _ ')' {var temp=  mergeExpression(elements);return {type:'ExpressionSimple',operator:temp.operator,operand:temp.operand};}
/ '(js`' val:[^`]* '`)'  {return {type:'ExpressionJavascript',native:esprima.parse(val.join(''))};}

interactionElement 'an interaction element'
= _ operand:interaction {return {operand:operand};}
/ _ operator:operatorIdentifier {return {operator:operator};}


////////////////////////////////////////////////////////////////////////////////
// Literals and leaves of the AST

operatorIdentifier 'an operator identifier'
= val:[^ \t\r\n$_\(\)\`]+ { return val.join(''); }

interfaceIdentifier 'an interface identifier'
= first:[A-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

dataIdentifier 'a data identifier'
= first:[A-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

variableIdentifier 'a variable identifier'
= first:[a-z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

keyIdentifier 'a key identifier'
= first:[a-z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

_ 'white space'
= [ \t\r\n]*

////////////////////////////////////////////////////////////////////////////////
