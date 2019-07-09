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

{% tufte %}
Gonna have to find a better name than that though :-) PIN! sounds totally contrived.
{% endtufte %}

This architecture is similar to the good old MVC pattern, with the difference that the controller (here the machine) encapsulates the model (the machine's state), defines what to do (the commands), and delegates away command execution. The architecture however avoids issues related to both [the fat model and fat controller pattern](http://www.theturninggear.com/2018/11/20/fat-controllers-vs-fat-models/), by refusing to include business logic into the controller or model. If I had to give it a name, it would be *PIN!*: *Parse, Interpret, Next!*. The idea is to emphasize that events arriving to a user interface are similar to lines of code, which are parsed and interpreted line after line. The machine parses the events into commands, the command handler interprets the commands. The machine then waits for the next input. The view plays no specific rule in this architecture, it is an interfaced system like any other. The architecture itself, in the frame of this documentation, I will simply call the Kingly architecture.

## Modelling behaviour
In short: 

-   a user interface can be specified by a relation between events received by the user interfaces and actions to be performed as a result on the interfaced system.
-   Because to the same triggering event, there may be different actions to perform on the interfaced system (depending for instance on when the event did occur, or which other events occurred before), we use $state$ to encode that variability, and specify the user interface with a function  $f$  such that  $actions = f(state, event)$. We call here  $f$  the reactive function for the user interface.
-   The previous expression suffices to specify the user interface's behaviour, but is not enough to deduce an implementation. We then use a function  $g$  such that  $(actions\_n, state\_{n+1}) = g (state\_n, event\_n)$. That is, we explicitly include the modification of the state triggered by events. Depending on the choice that is made for  $state_n$, there is an infinite number of ways to specify the same user interface.
-   a state machine specification is one of those ways with some nice properties (concise specification, formal reasoning, easy visualization). It divides the state into control states and extended state. For each control state, it specifies a reactive sub-function which returns an updated state (i.e. a new control state, and a new extended state) and the actions to perform on the interfaced system.

We are now going to illustrate those equations with a simple example.
