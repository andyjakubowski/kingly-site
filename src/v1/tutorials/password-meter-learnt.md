---
title: What we learnt
type: tutorials
order: 7
---

User interface behaviour can be described accurately with a state machine, which can be visualized through a graph. The graph is often a more concise, precise and easy to understand description of requirements.

Writing the behaviour as a state machine also makes some behaviour impossible by construct, which gives us contracts for free (such as the user cannot submit a weak password). Moreover, the machine will react gracefully to unexpected events -- by ignoring them. This contributes to robust UIs.

The behaviour of the interface is completely separated from the DOM representation and update concerns. This is why Kingly self-describes as the library for portable UIs. We can thus use any UI library we want -- or no library, according to our preferences and requirements:

|*UI library* |Possible reason for choice |
|:---|:---|
|*Vanilla JS* | potentially fastest|
|*morphdom*| real DOM diffing, no virtual DOM|
|*Vue*| template-based, easier to cooperate with designers with HTML skills|
|*React*| virtual DOM diffing, large ecosystem|

For the modelization of a [more complex user interface](https://sarimarton.github.io/tmdb-ui-cyclejs/dist/#/), and more details on the benefits of state machine, I'll refer the reader to a [detailed article](https://medium.com/dailyjs/user-interfaces-you-can-trust-with-state-machines-49de7fa138a6) on the subject.
 
