# Base interactions

Some interactions are built in right into the language itself, they will be used to implement all the other features, using libraries.

## Literals

Any literal of all base type is a built in interaction.

### Activation

These comply to the interface `activation out`

`(active)` and `(inactive)`

### Boolean

These comply to the interface `boolean out`

`(true)`, `(false)`, and `(inactive)`

### Number

These comply to the interface `number out`

`(0)`, `(1)`, `(2)`, ... , `(infinity)`,`(-infinity)`,...,`(-1)`,`(3.14159)`,`(12e3)`,`(6.626e-34)`,`(pi)`,`(e)`, and of course, `(inactive)`

### Text


These comply to the interface `text out`

`("")`,`("A text")`,`("A multi-line\ntext")`,`("Anything between double quotes")`, and of course, `(inactive)`

### Function

These comply to the interface ` <domain> -> <codomain> out`

They are basically any piece of native code between backticks. So far domain and codomain must be tuple types. The code must use function arguments called arg0, arg1, ..., and return result called res0, res1, ...

```
(`
  var temp = in.0 * in.0 + in.1 * in.1;
  out = math.sqrt(temp);
`)
```


## Composition

Interactions that compose or decompose data into smaller bits, using compound types.


### Records

This one for example complies to the interface `{x:number,y:number} out`

`({x:(1),y:(2)})`

`((a).x)`



## Identification

Identification interactions are the **only** interactions that break referential transparency. They are useful mostly to keep referential transparency simple in the language. The question whether a specific interaction is referentially transparent is hence easy to answer: if it has one of these functions in it, then it is not, otherwise, it is.

### Time step

`(time step identifier):number out` is a number which is different on every time step, but has the same value in every interaction at the same time. It is not necessarily a counter, but it is unique, two time steps cannot have two similar time step identifiers... at least, normally... If we take 64 bits integer sequentially, then we can step at 1 GHz for 584 years, so that should be okay... It is useful to keep referential transparency, while using random numbers for example.

### Class

`(class identifier):number out` is a number which is constant in time, but different every time it appears in the **folded** source code, i.e. the code as written by the coder. It could be generated by a simple find/replace in a text editor.

### Instance

`(instance identifier):number out` is a number which is constant in time, but different every time it appears in the **unfolded** source code, i.e. once the whole code is inlined in one massive composition of basic interactions during the compilation process.

### Intermediates between Class and instance

Class identifier is **before all** unfolding, while Instance identifier is **after all** unfolding. It should be good to add a notion of unfolding step, and add an identifier for when this is unfolded...

## The most useful stuff

### Previous

The only way to make a piece of data travel between two different time steps.

`(previous(x:<type> in)) : <type> out`

Example of use :

`((x)=(previous(x)))` will have the effect that `x` will always be the same.

### Function application

Is equivalent to its `result` argument, and at the same time, evaluate a given `function` on a given `element` and put the result in `image`.

```
(
  (result:<interface>)
  in
  (function:<domain> -> <codomain> in)
  applied to
  (element:<domain> in)
  returns
  (image:<codomain> out)
): co-<interface>
```
Example of use :

```
interaction
  (Square root of (a:number in) plus (b:number in)):number out
is
  (
    (res) in
    (f) applied to ({a:(a)b:(b)}) returns (res)
  )
with

  interaction
    (res):number ref

  interaction
    (f):{a:number,b:number} -> number out
  is
    (
      js `
      out = Math.sqrt(in.a + in.b);
      `
      c `
      out = sqrt(in->a + in->b);
      `
    )




```


### Local

`(local of (a))`

Block the scoping mecanism. This is to define a local variable, it can be a in or a out.
Assign a value or get a value from an identifier, but do not execute its content.



# Non base interactions

## Behaviors



### Behavior

Is equivalent to its first argument, while always activating its second argument.

`((a:<interface>)with behavior(b:activation out)):co-<interface>`

Example of use:

`((x)with behavior((x)=(5)))` is equivalent to `(5)`



### All

```
interaction
  (all (a:<type> out) (b:<type> out)):<type> in
is
  ((x) in (`out.a=in;out.b=in;`) applied to (x) returns ({a:(a),b:(b)}))
with
  interaction
    (x):<type> ref
```

### Affectation

Simple affectation

```
interaction
  ((a:<type> out)=(b:<type> in)):activation in
is
  ((x) in
  (`out = (in.x.active === true)?in.b:{active:false,value:0}`)
  applied to ({x:(x),b:(b)}) returns (a))
with
  interaction (x):<type> ref

```

Example of use:

`((x)=(3))` means that x will get 3.


### When

```
interaction
  (when (cond:activation in) then (effect:activation out)):activation in
is
  ((x) in
  (`out.active = in.x.active && in.y.active;`)applied to ({x:(x),y:(cond)}) returns (effect))
with
  interaction (x) : activation ref
```

### Reception

This is the result of a templating macro

```
interaction
  (reception of (x:{a:<t1> in,b:<t2> out})):<t1> out
is
  ((res) in (identity) applied to ({x:a}) returns (res) )
with
  import iii/identity
  interaction (res):<t1> ref
```

```
interaction set
  `
    function implementationOf(construct){
      if(construct.operator)
    }
  `
```
