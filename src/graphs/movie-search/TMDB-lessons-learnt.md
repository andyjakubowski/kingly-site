---
title: What we learnt
type: _tutorials
order: 20
---

We illustrated in this tutorial one methodology for reach a state-machine modelization called **step-wise refinement** or **top-down design**. We did that while maintaining a correspondence between the code and the equivalent state machine. The equivalence is such that a Kingly state machine can be compiled into a standard JavaScript function similar to the code we have shown.

When refining, piece of state will appear, and the machine designer will have to choose between control and extended state to hold that piece of state. I attempted to give some rationale about which to choose in which context and why.

We introduced routing with state machines. Routing consists of a sequence of route changes, each of which resulting in some commands to perform, culminating in the user interface being in some state. State machines can modelize this easily.
