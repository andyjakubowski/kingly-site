# Compiler
- write with labe a la sweet.js

```
const initialControlState = ...
const states = ...
const events = ...
const name = "..."; // name of the machine

fsmFactory = fsm({initialControlState, initialExtendedState, states, events, name})`
  In State ... {
    When event {
      DO action
    } 
    When event {
      guard? DO action
      guard? DO action
    } 
    Then {// eventless transition
      guard? DO action
      guard? DO action
    }
  }
`
```


# Language example
## Flat machine
### Declaration

```fsm
Final State Done
In State Init {
  When navigated to url {
    DO display initial screen
    GOTO State Weak
  }
}
In State Weak {
  When typed {
    letters and numbers? 
      DO display strong password screen;
      GOTO Strong
    not letters and numbers? 
      DO display weak password screen
      GOTO State Weak
  }
}
In State Strong {
  When typed {
    letters and numbers? 
      DO display strong password screen;
      GOTO Strong
    not letters and numbers? 
      DO display weak password screen
      GOTO State Weak
  }
  When clicked submit {
    DO display password submitted screen;
    GOTO Done;
  }
}
```

### Flat machine compiled
fsm event settings =
  Init: fsmInit event settings 
  Weak: fsmWeak event settings 
  Strong: fsmWrong event settings 
  Done: fsmDone event settings 

fsmInit event settings =  
  navigated to url:
    set control state to Weak
    <- display initial screen(event, extended state, settings)
  _: Warning `event not accepted by the machine in the control state ${_}!`

and so on!

## Hierarchical machine
### Modelization
![](https://brucou.github.io/documentation/graphs/chess%20game%20with%20hierarchy%20no%20undo.jpg)

### Compiled
```none
fsm event settings =
  Init: fsmInit1 event settings 

fsmInit1 event settings =
  <- fsmWhiteTurn event settings 

fsmWhiteTurn event settings =
  <- fsmWhitePlays event settings

fsmWhitePlays event settings =
  click && white piece => 
    set control state to Piece Selected
    <- execute action // that includes internal state updates
  _: Warning `event not accepted by the machine in the control state ${_}!`
```

Compound state can only delegate to their init transitions!! Atomic states can test for events non init 

That should work!!

## Hierarchical machine with forwarded events
### Modelization
![](https://brucou.github.io/documentation/graphs/chess%20game%20with%20hierarchy%20with%20undo%20with%20emphasis.jpg)

### Compiled
```none
fsm event settings =
  Init: fsmInit1 event settings 

fsmInit1 event settings =
  <- fsmWhiteTurn event settings 

fsmWhiteTurn event settings =
  <- fsmWhitePlays event settings

fsmWhitePlays event settings =
  click && white piece => 
    set control state to Piece Selected
    <- execute action // that includes internal state updates
  undo && >0 moves
    set control state to Black plays
    <- Undo
  _: Warning `event not accepted by the machine in the control state ${_}!`
```

Option 1: I distribute the events attached to compound states to all substates down to atomic states.

- this does not allow for event forwarding! which is fine, that is a good default

### Compiled with event forwarding possible
```none
fsm event settings =
  Init: fsmInit1 event settings 

fsmInit1 event settings =
  <- fsmWhiteTurn event settings 

fsmWhiteTurn event settings =
  fsmWhitePlays event settings ? <- . // if not None return that, else continue
  undo && >0 moves?  
    set control state to Black plays
    <- Undo     

fsmWhitePlays event settings =
  click && white piece => 
    set control state to Piece Selected
    <- execute action // that includes internal state updates
  _: <- None
```

// TODO
eventless transitions and history states!
- history states is easy, it is updated together with the extended state
- eventless transitions is easy too, I already did it with the compound state
so I am good

## Issues
- partials!
  - I want to insert a machine into a machine!
  - might need macros generating strings?
- dynamic machines
  - cannot do, I need to know the shape of the machine from the syntax, else no gains in compiling? kind of like using the library if it is dynamic
- I could define macro by string substitution and then feed the result in the parser. could work. don't know if that would be useful

So:
- states will have to be string literal always, with reserved strings or symbols like INIT
- events, actions and predicates will be imported ALWAYS from JS (will be used in the UI so better put it in one JS place)
- two imported events with different variable names MUST be different events (e.g. have different values)
- transitions only will have to be fixed (not dynamic)
- the rest (initial state, updateState, etc.) will come from JS imports
- transitions will be in .fsm files
- transitions will need an import mechanism between .fsm files
- we could then have an import as mechanism for renaming states? TO THINK ABOUT
  - better, if I want to reuse machines, I need a renaming facility at inclusion site
- then I also need a macro system...
- will be better to procsss files with node and generate a .js file instead of using babel!

## Syntax
JSX!

const fsmFactory = (
  <FsmFactory initialExtendedState=... initialControlState updateState controlStates whatelse?>
    <T from=... event, to, action />
    <T from=... event >
      <W to=... action  predicate />
      <W to=... action  predicate />
      <W to=... action  predicate />
    </T>
  </FsmFactory>
)
- then cf. [babel-plugin-brahmos](https://github.com/brahmosjs/brahmos/blob/master/docs/HOW_IT_WORKS.md#Brahmos-Transformation-with-babel-plugin-brahmos) for jsx babel transformation
- when not compiled, transform it to `createFsm(...)`
  - f(props, children) => createFsm(merge(props, transitions: process(children)})
  - I might even be able to use a createElement which actually generate an array...  
- when compiled
  - (function fsmFactory(initialExtendedState, initialControlState, ...){
    let local state
    return function fsm(){...}
  })(...)
- that is a way that means I don't have to create a specific extension!! but I do have to create a babel plugin
  - but I can get inspiration from other jsx plugins!
- only issue is I may have other jsx with a different createElement!! how to handle that
  - look for magic comment line as first lineof the file!
