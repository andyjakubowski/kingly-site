---
title: Implementing UIs with state machines
type: tutorials
order:  3
---

Implementing UI with state machines comes in two parts: implementing the behaviour of the UI, and implementing the actual UI itself (i.e. the application). The behaviour is simply the relation between events received by the interface and commands to perform on the interfaced systems. The actual UI includes performing the commands on the interfaced systems and creating listeners for the events accepted by the UI.

## Architecture
Kingly is thus designed to encourage an UI implementation consisting of three separate modules with separate concerns:

![kingly-favoured ui architecture](../../graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly.jpg)

The interfaced systems -- that includes the input device (e.g. your laptop or mobile phone), send events to the Kingly machine. The machine computes commands which are executed by command handlers. Those commands may result in API calls on the interfaced systems, whose responses may be processed by the command handler module, which in turn decides whether to send an event back to the machine for processing. Note that the output device -- typically a screen, is but one of the interfaced systems, and the operation of rendering is but a command to the interfaced output device.

## Modelling behaviour
A user interface can be specified by a relation between events received by the user interfaces and actions to be performed as a result on the interfaced system. With Kingly, you are expressing this relation with a procedure `fsm` which takes an event received by the interface into commands to perform on the interfaced systems: `commands = fsm(event)`. 

In most of the cases, the same event may result in different commands to be executed. This means that the `fsm` procedure is a stateful one. A Kingly state machine is such a function, which **encapsulates** the necessary state so that it is only accessible and visible to thee `fsm` function itself. If we make the encapsulated state visible, we can define a pure function $g$ such that  $(actions\_n, state\_{n+1}) = g (state\_n, event\_n)$, where $n$ is tne $n^{th}$ invocation of the `fsm`  function for the $n^{th}$ input it processes.

Additionally, a Kingly state machine divides its encapsulated state in two kinds of state: control states, and extended state. The machine starts in an initial control state. For each control state, the state machine must define a sub-procedure `fsm'` which will:
- perform the computation of commands when the machine is in that control state (i.e. `fsm(event) = fsm'(event)`)
- update its control state (we say that the machine *transitions* to its new control state) if some conditions are fulfilled (we call such conditions *guards*)
- update its extended state

Control states thus define a 'formula' computing the commands, while the extended state gathers the data necessary to perform the computation. As the machine changes control state, the computation to perform changes accordingly. Control states may for instance serve to modelize interfaces going through different screens, associating a different relation between events and commands (i.e. behaviour) to each screen.

State machine can be visually represented by a graph which links two control states whenever there is a possible transition between the two control states. The visualized graph summarizes accurately the `fsm` computation, i.e. the behaviour of the interface to implement. 

Modelizing an interface behaviour with state machines has the following advantanges:
- the machine visualization is an accurate specification of the interface behaviour
- the machine visualization can be used to communicate the behaviour to programmers and non-programmers alike, including designers, project managers and other project stakeholders
- the state machine can be *compiled* to a standard JavaScript function which implements the interface behaviour

Using Kingly as a state machine library has the following advantage:
- the behaviour of the machine, i.e. the computation of commands to perform, is completely separated from the execution of those commands. This means that any rendering library can be used to display the user interface, **without any modification of the machine implementation**
- a Kingly machine is a standard JavaScript function which performs no effects. This means it is easy to test, without resorting to mocking, with any testing library of your choice.
- test input sequences for the machine can additionally be automatically computed
- the interface behaviour being separated from other concerns, it can be reused and shared among projects (for example on `npm`). 

## Implementation
The typical process I follow consists in:
- get a refined understanding of the interface behaviour from its informal specifications
- define the user interface's interface (i.e. *props* interface, and dispatched events)
- implement and test the user interface
- define the command module interface (i.e. which commands are triggered by the user, the shape of those commands, and which events they produce as a result of their execution)
- implement and test the command module
- modelize the interface behaviour with a graph editor (I recommend [yed](https://www.yworks.com/downloads#yEd))
- write some tests (with at least all-transitions coverage of the modelized machine)
- write the definition of the machine (i.e. initial state, events, transitions, guards, action factories) and pass the previous tests
- write and pass a few integration tests (all-states coverage may suffice if high confidence derived from unit tests)
- fully test the machine with automatically generated tests

We will address automated test generation in a future dedicated section. We are now going to see in the following tutorials some examples of UI modelization with Kingly state machines.
