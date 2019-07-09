---
title: Why Kingly
type: tutorials
order: 0
---

Kingly is a state machine library to specify user interface **behaviour**. It is designed to be used in conjunction with **any user interface library or framework** (such as React, Vue, Svelte, or Vanilla JavaScript); and for parts (components) or the whole of your user interface. You **declaratively** specify the behaviour of your user interface as a set of actions to perform in response to events processed by the user interface. The actions to perform in response to events are computed by a state machine. The state machine acts as a **model** of the interface's behaviour, which can be instrumented in several ways of interest to speed up the development of your application:

- the model is a **single source of truth**, and **living documentation** for the behaviour of your interface
- the model can be visualized to communicate and discuss features both within and outside your development team (designers, testers, developers)
- test sequences can be **automatically generated** from the model, and used for both unit testing and integration testing
- you can iterate quickly and with confidence on the model, knowing what part of the behaviour your modifications will impact and **what part will not be impacted**
- the model can be shared and reuse in other projects by simply publishing it on `npm` or any package manager of your choice

The net result is a productive development process resulting in **robust, maintainable, self-documented user interfaces or components**.

If you want to understand the benefits of state-machine-based modelization of interface behaviour, I published a [detailed article](http://www.infoq.com/articles/robust-user-interfaces-with-state-machines) which provides a 10,000 feet view, easy-to-follow review of the subject.

The next sections of the tutorial build progressively the concepts, demonstrating the library's API, and providing meaningful examples.
