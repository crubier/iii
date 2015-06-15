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
= _ 'interaction' _ signature:signature  _ definitions:(_ 'with' _ definitions:definitions {return definitions;})? _'is' _ expression:expression  _{ return {type:'Definition',expression:expression,signature:signature,definitions:(definitions===null?[]:definitions)};}

signature 'an interaction signature specification'
= '('  elements:signatureElement* _ ')' _ ':' _ interface:interface { var temp = mergeSignature(elements);return {type:'Signature',interface:interface,operator:temp.operator,operand:temp.operand};}

signatureElement 'a signature element'
= _ operator:operatoridentifier {return {operator:operator};}
/ _ '(' _ name:variableidentifier _':'_ interface:interface _ ')' {return {operand:{interface:interface,name:name}};}



////////////////////////////////////////////////////////////////////////////////
// Interface specifications

interface 'the specification of an interface'
= interfaceAtomic / interfaceComposite / interfaceOperation

interfaceOperation 'the specification of an interface using operators'
= operator:interfaceOperator _ '(' _ first:interface rest:(_',' _ content:interface {return content;})* _')' { return {type:"InterfaceOperation",operator:operator,operand:mergeElements(first,rest)}}

interfaceOperator 'an interface operator (conjugation,globalisation,localisation,reception,emission,union,intersection,complement)'
= 'conjugation' / 'globalisation' / 'localisation' / 'reception' / 'emission' / 'union' / 'intersection' / 'complement'

interfaceAtomic 'the specification of an atomic interface'
= datatype:datatype _ direction:direction {return {type:'InterfaceAtomic',datatype:datatype,direction:direction};}

interfaceComposite 'the specification of a composite interface'
= '{' _ first:(key:keyidentifier _ ':' _ value:interface {return {type:'InterfaceCompositeElement',key:key,value:value}}) _ rest:(',' _ content:(key:keyidentifier _ ':' _ value:interface {return {type:'InterfaceCompositeElement',key:key,value:value}}) _ {return content;})* '}' {return {type:'InterfaceComposite',element:mergeElements(first,rest)};}


////////////////////////////////////////////////////////////////////////////////
// Data Types specifications

type 'the specification of a data type'
= typeAtomic / typeComposite / typeArray / typeFunction / typeOperation

typeOperation 'the specification of an data type using operators'
= operator:typeOperator _ '(' _ first:type rest:(_',' _ content:type {return content;})* _')' { return {type:"TypeOperation",operator:operator,operand:mergeElements(first,rest)}}

typeOperator 'an data type operator (union,intersection,complement)'
= 'union' / 'intersection' / 'complement'

typeAtomic 'the specification of an atomic data type'
= name:datatypeidentifier {return {type:'TypeAtomic',name:name}}

typeComposite 'the specification of a composite data type'
= '{' _ first:(key:keyidentifier _ ':' _ value:type {return {type:'TypeCompositeElement',key:key,value:value}}) _ rest:(',' _ content:(key:keyidentifier _ ':' _ value:type {return {type:'TypeCompositeElement',key:key,value:value}}) _ {return content;})* '}' {return {type:'TypeComposite',element:mergeElements(first,rest)};}

typeArray 'the specification of an array type'
= '[' _ element:type _ ']' {return {type:'TypeArray',element:element};}

typeFunction 'the specification of a function type'
= '(' _ domain:type _ ('→'/'->') _ codomain:type _')'{return {type:'TypeFunction',domain:domain,codomain:codomain};}

////////////////////////////////////////////////////////////////////////////////
// Direction
direction 'the direction of a data flow'
= 'out' / 'in' / 'ref'

////////////////////////////////////////////////////////////////////////////////
// Interaction expressions
expression 'an interaction expression'
= '(' elements:expressionelement* _ ')' {var temp=  mergeExpression(elements);return {type:'ExpressionSimple',operator:temp.operator,operand:temp.operand};}
/ '(js`' val:[^`]* '`)'  {return {type:'ExpressionJavascript',native:esprima.parse(val.join(''))};}


expressionelement 'an expression element'
= _ operand:expression {return {operand:operand};}
/ _ operator:operatoridentifier {return {operator:operator};}


////////////////////////////////////////////////////////////////////////////////
// Literals and leaves of the AST

operatoridentifier 'an operator identifier'
= val:[^ \t\r\n$_\(\)\`]+ { return val.join(''); }

interfaceidentifier 'an interface identifier'
= first:[A-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

datatypeidentifier 'a data type identifier'
= first:[A-Z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

variableidentifier 'a variable identifier'
= first:[a-z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

keyidentifier 'a key identifier'
= first:[a-z] rest:[a-zA-Z0-9]* { return mergeElements(first,rest).join(''); }

_ 'white space'
= [ \t\r\n]*

////////////////////////////////////////////////////////////////////////////////
