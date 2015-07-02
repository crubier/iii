
// High level elements
//TODO

start
= composition / selection / previous / identifier / functionApplication / behavior

composition 'a composition interaction'
= _ '{' _ (key:keyIdentifier _':'_'$'_ )* '}' _ {return "Composition";}


selection 'a selection interaction'
= _ '$' _ '.' _ key:keyIdentifier _ {return "Selection";}

previous 'a previous interaction'
= _ 'previous' _ '$' _ {return "Previous";}

identifier 'an identifier interaction'
= _ '#' _ identifier:operatorIdentifier _ ('$')* _ {return "Identifier";}

functionApplication 'a function application interaction'
= _ '$' _ 'in' _ '$' _ '$' _ '=' _ '$' _ {return "FunctionApplication";}



//TODO










direction 'the direction of a data flow'
= 'out' / 'in' / 'ref'


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
