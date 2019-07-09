---
title: Overview
type: api
order: 0
---

To start defining state machine with Kingly, it is necessary to get acquainted with:
- the basic state machine formalism
- its extension, including hierarchy (compound states), and history states
- the library API
- the semantics for a Kingly machine

For those with interest in software architecture, we will start with the principles at the core of Kingly design. Alternatively, you can skip to the next section where we introduce the Kingly configuration for standard state machines and hierarchical state machines. We then cover in detail the API semantics. 

In the remainder of this page, we will dedicate a section to each function part of the Kingly API. Those sections aims to serve as reference documentation for the function. If there is anything you would like to add, ping me on [twitter](https://twitter.com/bricoi1). 

## API design
The key objectives for the API was:

- **generality**, **reusability** and **simplicity** 
  - there is no explicit provision made to accommodate specific use cases or frameworks
  - it must be possible to add a [concurrency and/or communication mechanism](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.92.6145&rep=rep1&type=pdf) on top of the current design
  - it must be possible to integrate smoothly into React, Angular and your popular framework
  - support for both interactive and reactive programming
- parallel and sequential composability of state machines

As a result of this, the following choices were made:

- **functional interface**: the state machine is just a function. As such, it is a black-box, and only its computed outputs can be observed
- **complete encapsulation** of the state of the machine
- **no effects** performed by the machine
- no exit and entry actions, or activities as in other state machine formalisms
  - there is no loss of generality as both entry and exit actions can be implemented with our state machine. There is simply no syntactic support for it in the core API. This can however be provided through standard functional programming patterns (higher-order functions, etc.)
- every computation performed is synchronous (asynchrony is an effect)
- action factories return the **updates** to the extended state to avoid any unwanted direct modification of the extended state (API user must provide such update function, which in turn allows him to use any formalism to represent state - for instance `immutable.js`)
- no restriction is made on output of Kingly machines, but inputs must follow some conventions (if a machine's output match those conventions, two such machines can be sequentially composed
- parallel composition naturally occurs by feeding two state machines the same input(s))
  - as a result, reactive programming is naturally enabled. If `inputs` is a stream of well-formatted machine inputs, and `f` is the fsm, then the stream of outputs will be `inputs.map(f)`. It is so simple that we do not even surface it at the API level.

Concretely, our state machine will be created by the factory function `createStateMachine`, which returns a state machine which:

- immediately positions itself in its configured initial state (as defined by its initial control state and initial extended state) 
- will compute an output for any input that is sent to it since that

Let us insist again on the fact that the state machine is not, in general, a pure function of its inputs. However, a given output of the machine depends exclusively on the sequence of inputs it has received so far ([causality property](https://en.wikipedia.org/wiki/Causal_system)). This means that it is possible to associate to a state machine another function which takes a sequence of inputs into a sequence of outputs, in a way that **that** function is pure. This is what enables simple and automated testing.

## General concepts
We encourage the novice reader to refer to the [tutorials](../tutorials) for a step-by-step introduction to the concepts, with examples analyzed by order of complexity. In this section, we will use the example of a reasonably complex CD player application, whose behaviour is modelled by a hierarchical state machine. For this example, we will show a run of the machine, and by doing so, illustrate advanced concepts such as compound states, and history states. This example will be focused on the modelling rather than the implementation. The reader can refer to the [examples](../examples) section of this documentation for full-fledged examples. 

### CD drawer modelization
This example is taken from Ian Horrock's seminal book on statecharts and is the specification of a CD player. The behaviour of the CD player is pretty straight forward and understandable immediately from the visualization. From a didactical point of view, the example serves to feature advanced characteristics of hierarchical state machines, including history states, composite states,  transient states, automatic transitions, and entry points. For a deeper understanding of how the transitions work in the case of a hierarchical machine, you can have a look at the [terminology](https://github.com/brucou/kingly#terminology) and [sample run](#Example-run) for the CD player machine.
 
![cd player state chart](http://i.imgur.com/ygsOVi9.jpg)

The salient facts are:
- `NO Cd loaded`, `CD_Paused` are control states which are composite states: they are themselves state machines comprised on control states.
- The control state `H` is a pseudo-control state called shallow history state
- All composite states feature an entry point and an automatic transition. For instance `CD_Paused` has the sixth control state as entry point, and the transition from `CD_Paused` into that control state is called an automatic transition. Entering the `CD_Paused` control state automatically triggers that transition.
- `Closing CD drawer` is a transient state. The machine will automatically transition away from it, picking a path according to the guards configured on the available exiting transitions

### Example run
To illustrate the previously described machine semantics, let's run the CD player example.

| Control state      | Internal event | External event|
|--------------------|:-----------:|------------------|
| INIT_STATE         |  INIT_EVENT |                  |
| No Cd Loaded       |     INIT    |                  |
| CD Drawer Closed   |      --     |                  |
| CD Drawer Closed   |             | Eject            |
| CD Drawer Open     |             | Eject (put a CD) |
| Closing CD Drawer  |  eventless  |                  |
| CD Loaded          |     INIT    |                  |
| CD Loaded subgroup |     INIT    |                  |
| CD Stopped         |      --     |                  |
| CD stopped         |             | Play             |
| CD playing         |             | Forward down     |
| Stepping forwards  |             | Forward up       |
| **CD playing**     |      --     |                 .|

Note:

- the state entry semantics -- entering `No Cd Loaded` leads to enter `CD Drawer Closed`
- the guard -- because we put a CD in the drawer, the machine transitions from `Closing CD Drawer` to `CD Loaded` 
- the eventless transition -- the latter is an eventless transition: the guards are automatically evaluated to select a transition to progress the state machine (by contract, there must be one)
- the hierarchy of states -- the `Forward down` event transitions the state machines to `Stepping forwards`, as it applies to all atomic states nested in the `CD Loaded subgroup` control state
- the history semantics -- releasing the forward key on the CD player returns to `CD Playing` the last atomic state for compound state `CD Loaded subgroup`.
 

## Kingly machine semantics
We give here a quick summary of the behaviour of the state machine:

**Preconditions**
- the machine is configured with a set of control states, an initial extended state, transitions, guards, action factories, and user settings
- the machine configuration is valid (cf. contracts)
- Input events have the shape `{[event_label]: event_data}`

**Event processing**
- Calling the machine factory creates a machine according to specifications and triggers the reserved `INIT_EVENT` event which advances the state machine out of the reserved **internal** initial control state towards the relevant **user-configured** initial control state
  - the `INIT_EVENT` event carries the initial extended state as data
  - if there is no initial transition, API consumers must pass an initial control state
  - if there is no initial control state, API consumers must configure an initial transition
  - an initial transition is a transition from the reserved `INIT_STATE` initial control state, triggered by the reserved initial event `INIT_EVENT`
- **Loop**
- Search for a feasible transition in the configured transitions
  - a feasible transition is a transition which is configured to deal with the received event, and for which there is a fulfilled guard 
- If there are no feasible transitions:
  - issue memorized output (`NO_OUTPUT` if none); extended state and control state do not change. 
  - **break** away from the loop
- If there is a feasible transition, select the first transition according to what follows:
  - if there is an `INIT` transition, select that
  - if there is an eventless transition, select that
  - otherwise select the first transition whose guard is fulfilled (as ordered per array index)
- evaluate the selected transition
  - if the target control state is an history state, replace it by the control state it references (i.e. the last seen nested state for that compound state)
  - run the action factory defined in the selected transition to get extended state updates, and machine outputs
  - **update the extended state** (with the updates produced by the action factory)
  - **aggregate** and memorize the outputs
  - update the control state to the target control state defined by the selected transition
  - update the history for the control state (applies only if control state is a compound state)
- iterate on **Loop**
- ***THE END***

A few interesting points: 

- a machine always transitions towards an atomic state at the end of event processing
- on that path towards an atomic target state, all intermediary extended state updates are performed. Guards and action factories on that path are thus receiving a possibly evolving extended state. The computed outputs will be aggregated in an array of outputs.
 
The aforedescribed behaviour is loosely summarized here:

{% fig %}
![event processing](../../api-assets/FSM%20event%20processing%20semantics.png)
{% endfig %}


**History states semantics**

An history state relates to the past configuration a compound state. There are two kinds of history states: shallow history states (H), and deep history states (H*). A picture being worth more than words, thereafter follows an illustration of both history states:

{% fig %}
![deep and shallow history](../../api-assets/history%20transitions,%20INIT%20event%20CASCADING%20transitions.png)
{% endfig %}


Assuming the corresponding machine has had the following run `[INIT, EVENT1, EVENT3, EVENT5, EVENT4]`:
 
- the configurations for the `OUTER` control state will have been `[OUTER.A, INNER, INNER.S, INNER.T]`
 - the shallow history state for the `OUTER` control state will correspond to the `INNER` control state (the last direct substate of `OUTER`), leading to an automatic transition to INNER_S  
 - the deep history state for the `OUTER` control state will correspond to the `INNER.T` control state (the last substate of `OUTER` before exiting it)

In short the history state allows to short-circuit the default fixed entry behaviour for a compound state, which is to follow the transition triggered by the `INIT` event. When transitioning to the history state, transition is towards the last seen state for the entered compound state.

### Contracts

#### Format
- state names (from `fsmDef.states`) must be unique and be JavaScript strings
- event names (from `fsmDef.events`) must be unique and be JavaScript strings
- reserved states (like `INIT_STATE`) cannot be used when defining transitions
- at least one control state must be declared in `fsmDef.states`
- all transitions must be valid:
  - the transition syntax must be followed (cf. types)
  - all states referenced in the `transitions` data structure must be defined in the `states` data structure
  - all transitions must define an action (even if that action does not modify the extended state or returns `NO_OUTPUT`)
- all action factories must fill in the `updates` and `outputs` property (no syntax sugar)
  - `NO_OUTPUT` must be used to indicate the absence of outputs
- all transitions for a given origin control state and triggering event must be defined in one row of `fsmDef.transitions`
- `fsmDef.settings` must include a `updateState` function covering the state machine's extended state update concern.

#### Initial event and initial state
By initial transition, we mean the transition with origin the machine's default initial state.

- An initial transition must be configured:
  - by way of a starting control state defined at configuration time
  - by way of a initial transition at configuration time
- ~~the init event has the initial extended state as event data~~
- ~~The machine cannot stay blocked in the initial control state. This means that at least one 
transition must be configured and be executed between the initial control state and another state
.   This is turn means:~~
  - ~~at least one non-reserved control state must be configured~~
  - ~~at least one transition out of the initial control state must be configured~~
  - ~~of all guards for such transitions, if any, at least one must be fulfilled to enable a 
  transition away from the initial control state~~
- there is exactly one initial transition, whose only effect is to determine the starting 
control state for the machine
  - the action on any such transitions is the *identity* action
  - the control state resulting from the initial transition may be guarded by configuring 
  `guards` for the initial transition
- there are no incoming transitions to the reserved initial state

Additionally the following applies:
- the initial event can only be sent internally (external initial events will be ignored, and the 
machine will return `NO_OUTPUT`)
- the state machine starts in the reserved initial state

#### Coherence
- the initial control state (`fsmDef.initialControlState`) must be a state declared in `fsmDef.states`
- transitions featuring the initial event (`INIT_EVENT`) are only allowed for transitions involving compound states
  - e.g. `A -INIT_EVENT-> B` iff A is a compound state or A is the initial state
- all states declared in `fsmDef.states` must be used as target or origin of transitions in `fsmDef.transitions`
- all events declared in `fsmDef.events` must be used as triggering events of transitions in `fsmDef.transitions`
- history pseudo states must be target states and refer to a given declared compound state
- there cannot be two transitions with the same `(from, event, predicate)` - sameness defined for predicate by referential equality

#### Semantical contracts
- The machine behaviour is as explicit as possible
  - if a transition is taken, and has guards configured, one of those guards must be fulfilled, i.e. guards must cover the entire state space when they exist
- A transition evaluation must end
  - eventless transitions must progress the state machine
    - at least one guard must be fulfilled, otherwise we would remain forever in the same state
  - eventless self-transitions are forbidden (while theoretically possible, the feature is of little practical value, though being a possible source of ambiguity or infinite loops)
  - ~~eventless self-transitions must modify the extended state~~
    - ~~lest we loop forever (a real blocking infinite loop)~~
    - ~~note that there is not really a strong rationale for eventless self-transition, I recommend 
      just staying away from it~~
- the machine is deterministic and unambiguous
  - to a (from, event) couple, there can only correspond one row in the `transitions` array of the state machine (but there can be several guards in that row)
      - (particular case) eventless transitions must not be contradicted by event-ful transitions
      - e.g. if there is an eventless transition `A -eventless-> B`, there cannot be a competing `A -ev-> X`
      {% tufte %}
      *** There exists however semantics which allow such transitions, thus possibilitating event bubbling.
      {% endtufte %}
  - `A -ev> B` and `A < OUTER_A` with `OUTER_A -ev> C` !!: there are two valid transitions triggered by `ev`. Such transitions would unduely complicate the input testing generation, and decrease the readability of the machine so we forbid such transitions[^*]
- no transitions from the history state (history state is only a target state)
- A transition evaluation must always end (!), and end in an atomic state
  - Every compound state must have eactly one inconditional (unguarded) `INIT` transition, i.e. a transition whose triggering event is `INIT_EVENT`. That transition must have a target state which is a substate of the compound state (no hierarchy crossing), and which is not a history pseudo state
  - Compound states must not have eventless transitions defined on them (would introduce ambiguity with the `INIT` transition)
  - (the previous conditions ensure that there is always a way down the hierarchy for compound states, and that way is always taken when entering the compound state, and the descent process always terminate)
- the machine does not perform any effects
  - guards, action factories are pure functions
    - as such exceptions while running those functions are fatal, and will not be caught
  - `updateState:: ExtendedState -> ExtendedStateUpdates -> ExtendedState` must be a pure function (this is important in particular for the tracing mechanism which triggers two execution of this function with the same parameters)

Those contracts ensure a good behaviour of the state machine. and we recommend that they all be observed. However, some of them are not easily enforcable:

- we can only check at runtime that transition with guards fulfill at least one of those guards. 
In these cases, we only issue a warning, as this is not a fatal error. This leaves some flexibility to have a shorter machine configuration. Note that we recommend explicitness and disambiguity vs. conciseness. 
- purity of functions cannot be checked, even at runtime

Contracts enforcement can be parameterized with `settings.debug.checkContracts`.
