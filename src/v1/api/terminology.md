---
title: Terminology
type: api
order: 99
---

### Control state
Control states, in the context of an extended state machine is a piece of the internal state of the state machine, which serves to determine the transitions to trigger in response to events. Transitions only occur between control states. Cf. base example illustration. 

### Extended state
We refer by extended state the piece of internal state of the state machine which can be modified on transitioning to another state. That piece of internal state **must** be initialized upon creating the state machine. In this context, the extended state will simply take the form of a regular object. The shape of the extended state is largely application-specific. In the context of our multi-steps workflow, extended state could for instance be the current application data, which varies in function of the state of the application.

### Input
In the context of our library, we will use interchangeable input for events. An automata receives inputs and generated outputs. However, as a key intended use case for this library is user interface implementation, inputs will often correspond to events generated by a user. We thus conflate both terms in the context of this documentation.

### External event
External events are events which are external and uncoupled to the state machine at hand. Such events could be, in the context of an user interface, a user click on a button.

### Internal event
Internal events are events coupled to a specific state machine. Depending on the semantics of a particular state machine, internal events may be generated to realize those semantics. In the context of our library, we only generate internal events to trigger automatic transitions. 

### Initial event
In the context of our library, the initial event (<b>INIT_EVENT</b>) is fired automatically upon starting a state machine. The initial event can be used to configure the initial machine transition, out from the initial control state. However it is often simpler to just configure an initial control state for the machine.

### Automatic event
This is an internally triggered event which serves to triggers transitions from control states for which no triggering events are configured. Such transitions are called automatic transitions. Not firing an automatic event would mean that the state machine would be forever stuck in the current control state.

### Transition
Transitions are changes in tne control state of the state machine under study. Transitions can be configured to be taken only when predefined conditions are fulfilled (guards). Transitions can be triggered by an event, or be automatic when no triggering event is specified.

### Automatic transition
Transitions between control states can be automatically evaluated if there are no triggering events configured. The term is a bit confusing however, as it is possible in theory that no transition is actually executed, if none of the configured guard is fulfilled. We forbid this case by contract, as failing to satisfy any such guard would mean that the machine never progress to another state! In our CD player example, an automatic transition is defined for control state 3 (`Closing CD drawer`). According to the extended state of our machine, the transition can have as target either the `CD Drawer Closed` or `CD Loaded` control states.

### Self transition
Transitions can also occur with origin and destination the same conrol state. When that happens, the transition is called a self transition.

### Transition evaluation
Given a machine in a given control state, and an external event occuring, the transitions configured for that event are evaluated. This evaluation ends up in identifying a valid transition, which is executed (e.g. taken) leading to a change in the current control state ; or with no satisfying transition in which case the machine remains in the same control state, with the same extended state.

### Guards
Guards associated to a transition are predicates which must be fulfilled for that transition to be executed. Guards play an important role in connecting extended state to the control flow for the computation under specification. As a matter of fact, in our context, guards are pure functions of both the occurring event and extended state.

### Action factory
This is a notion linked to our implementation. An action factory is a function which produces information about two actions to be performed upon executing a transition : update the encapsulated extended state for the state transducer, and possibly generate an output to its caller. 

### Output
An output of the transducer is simply the value returned by the transducer upon receiving an input (e.g. event). We will sometimes use the term *action* for output, as in the context of user interface specification, the output generated by our transducers will be actions on the interfaced systems. Actions is quite the overloaded and polysemic terms though, so we will try as much as possible to use output when necessary to avoid confusion.
 
### Composite state
As previously presented, an hierarchical state machine may feature control states which may themselves be hierarchical state machines. When that occurs, such control state will be called a composite state. In our CD player example, the control state `CD loaded` is a composite state.

### Compound state
Exact synonim of *composite state*.

### Nested state
A control state which is part of a composite state.

### Atomic state
An atomic state is a control state which is not itself a state machine. In other words, it is a control state like in any standard state machine. In our base example, all states are atomic states. In our CD player example, the control state 5 is an atomic state. The `CD loaded` control state is not.

### Transient state
Transient states are control states which are ephemeral. They are meant to be immediately transitioned from. Transient state thus feature no external triggering event (but necessitates of internal automatic event), and may have associated guards. By contract, one of these guards,if any, must be fulfilled to prevent the machine for eternally remain in the same control state.   In our CD player example, the control state 3 is a transient state. Upon entering that state, the machine will immediately transition to either control state 1, or composite state `CD loaded`.

### Terminal state
The terminal state is a control state from which the machine is not meant to transition from. This corresponds to a designed or anticipated end of run of the state machine.

### History state
Semantics for the history state may vary according to the intended application of hierarchical automata. In our restrictive context, the history state allows to transition back to the previous control state that was previously transitioned away from. This makes sense mostly in the context of composite states, which are themselves state machines and hence can be in one of several control states. In our CD player example, there are a few examples of history states in the `CD loaded` composite state. For instance, if while being paused (atomic control state 6), the user request the previous CD track, then the machine will transition to... the same control state 6. The same is true if prior to the user request the machine was in control state 4, 5, or 7. History state avoids having to write individual transitions to each of those states from their parent composite state.

### Entry point
Entry points are the target of transitions which are taken when entering a given composite state. This naturally only applies to transitions with origin a control state not included in the composite state and destination a control state part of the composite state. An history state can also be used as an entry point. In our CD player example, control state 1 is an entry point for the composite state `No CD loaded`. The same stands for `H` (history state) in `CD Loaded` composite state. Similarly a transition from `No CD loaded` to `CD loaded` will result in the machine ending in control state 4 (`CD stopped`) by virtue of a chain of entry points leading to that control state.