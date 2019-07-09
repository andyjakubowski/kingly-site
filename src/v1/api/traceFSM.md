---
title: traceFSM
type: api
order: 2
---

`traceFSM :: Env -> FSM_Def -> FSM_Def`

## Description
This function converts a state machine `A` into a traced state machine `T(A)`. The traced state machine, on receiving an input `I` outputs an object with the following information :

- `outputs` : the outputs `A(I)` 
- `updates` : the update of the extended state of `A` to be performed as a consequence of receiving the input `I` 
- `extendedState` : the extended state of `A` **prior** to receiving the input `I`
- `newExtendedState` : the extended state of `A` **after** receiving the input `I` and computing the outputs
- `controlState` : the control state in which the machine is when receiving the input `I`
- `event::{eventLabel, eventData}` : the event label and event data corresponding to `I` 
- `settings` : settings passed at construction time to `A`
- `targetControlState` : the target control state the machine has transitioned to as a consequence of receiving the input `I`
- `predicate` : the predicate (guard) corresponding to the transition that was taken to `targetControlState`, as a consequence of receiving the input `I`
- `actionFactory` : the action factory which was executed as a consequence of receiving the input `I`
- `guardIndex` : the index for the guard in the `.guards` array of a transition away from a control state, triggered by an event
- `transitionIndex` : the index for the transition in the `.transitions` array which contain the specification for the machine's transition

Note that the trace functionality is obtained by decorating the action factories in `A`. As such, all action factories will see their output wrapped. This means:

- transitions which do not lead to the execution of action factories are not traced
- when the machine cannot find any transition for an event, hence any action to execute, the traced machine will simply return `null`.

Note also that `env` is not used for now, and will be used to parameterize the tracing in future versions of the library.

## Contracts
- [Type contracts](https://github.com/brucou/kingly/blob/master/src/types.js)

## Implementation example
Cf. [tests](https://github.com/brucou/kingly/blob/master/test/fsm_trace.specs.js)
