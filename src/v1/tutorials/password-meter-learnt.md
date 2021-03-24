---
title: What we learned
type: tutorials
order: 9
---

The behavior of user interfaces can be described accurately with a state machine, which can be visualized through a graph. The graph is often a more concise, precise, and easy-to-understand description of requirements.

Writing the behavior as a state machine also makes some behaviors impossible by construct, which gives us contracts for free (such as the assurance that a user cannot submit a weak password). Moreover, the machine will react gracefully to unexpected events -- by ignoring them. This contributes to robust UIs.

The behavior of the interface is completely separated from the DOM representation and update concerns. This is why Kingly self-describes as the library for portable UIs. We can thus use any UI library we want -- or no library, according to our preferences and requirements:

|*UI library* |Possible reason for choice |
|:---|:---|
|*Vanilla JS* | potentially the fastest option|
|*morphdom*| real DOM diffing, no virtual DOM|
|*Vue*| template-based, easier to cooperate with designers with HTML skills|
|*React*| virtual DOM diffing, large ecosystem|

Kingly machines can be traced thanks to a dev tool extension and optional debugging messages in the console. Kingly machines can be drawn with a graph editor and compiled into zero-dependency small vanilla JavaScript functions.

 
In the next tutorial, we will modelize a chess game interface as a state machine. This example will feature more advanced concepts such as hierarchy, history pseudo-states, dependency injection, and more.

Alternatively, the reader who would rather have a more conceptual overview of state machines can refer to a [detailed article](https://medium.com/dailyjs/user-interfaces-you-can-trust-with-state-machines-49de7fa138a6) on the subject.
