---
title: Why Kingly
type: tutorials
order: 0
---

Kingly is a state machine library to specify the **behavior** of applications. Kingly complements tools that specify the **appearance** of applications (e.g., Sketch, Figma). It is designed to be used in conjunction with **any user interface library or framework** (e.g., React, Vue, Svelte, or plain JavaScript). You can use it to describe the behavior of one component of your application, or that of the whole application. 

Your application behavior is what the application **should do** in response to the events it receives -- from the user, the network, and any other systems the application interfaces with. Kingly lets you **draw** your application response to events with a [professional graph editor](https://www.yworks.com/products/yed). Here is the drawn behavior of a wizard form that manages a user subscription process:

{% fig %}
![User application process](../../graphs/sparks%20application%20process%20with%20comeback%20proper%20syntax%20hierarchical%20fsm.png)
{% endfig %}

See the green path? That is the ideal path, which is when the user blazes through the wizard. Maybe it is more visible with another layout. Let the graph editor generate a circular layout for you instead. A few clicks later:

{% fig %}
![User application process](../../graphs/sparks%20application%20process%20with%20comeback%20proper%20syntax%20hierarchical%20fsm%20--%20circular%20layout%20cycle.png)
{% endfig %}

Well, the first layout maybe was not that bad. It does not matter, it is just one click away. 

The green path matches the original user flows provided by the design team:

{% fig %}
![User application process: user flow](https://imgur.com/xcO9xnY.jpg)
{% endfig %}

except that with Kingly's visual language, it can be made precise enough that a JavaScript implementation can be **automatically generated** from the graph. If you got the drawing right, the generated code will also be correct. In other words, you can **focus on getting the application logic right**, unencumbered by the accidental complexity that plagues application development (UI frameworks, target platforms, etc.). Your end users don't care if you use React or lensed global state. What can users do with your app? How easily can they do it? You want to spend your time getting the things that matter right; not on the idiosyncrasies of the framework *du jour*.

You can quickly iterate on the modeling of the application behavior, knowing that the generated code will be kept in sync. The drawn model, like your code, is versionable. You can go back to any versions at any time.

You won't break your budget. Kingly has a [compiler](http://localhost:4000/documentation/v1/tooling/compiling.html) that gets the implementation of your application behavior between 0.5 and 3 KB. The behavior for the wizard form previously shown was compiled down to 0.7 KB.

One more thing. Kingly aims at increasing development velocity by nudging you [to fall in the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/). Of the many impediments to a happy developer life, we singled out three. You know them; you stared at them many times in the face; we took them on:

- **Implement the wrong thing**: By linking specification (the drawing) to implementation (automatically generated), Kingly decreases the chance that you waste everybody's time implementing the wrong thing. A visual specification can be versioned, iterated on, and reviewed like code. Except that your reviewer may now be the product owner. He won't read code, but he can follow arrows on a graph. We kept it simple so he could.
- **Implement the right thing wrong**:  Kingly makes sure that the behavior that you specified is correctly implemented. For sure, this event will trigger that command, but that command could be wrongly implemented. Kingly minimizes this by making it easy to automatically generate thousands of tests from your drawn behavior. Unlike end-to-end tests, they will run fast.
- **Entangled architecture that makes things hard to change**: Development is an iterative process that often slows down with application size. A core driver of the slow-down is coupling: part A resists to changes of part B because they are strongly linked. The answer is modularity and decoupling. Kingly favors an [hexagonal architecture](https://www.infoq.com/news/2014/10/exploring-hexagonal-architecture/) that cleanly separates application behavior from the rest (UI framework, database, etc.). You don't need to [juggle with 5 (undocumented) things in your head](link to some articles where I describe the issue with view-driven app) every time you change something.

The part about architecture comes last; it is not the most intuitive for many; but it may be the most valuable part. Robert C. Martin, one signatory of the influential [Agile Manifesto](https://agilemanifesto.org/principles.html), had the following [comment about the hexagonal architecture](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html) and its variants:

> That kind of flexibility and decoupling always speeds you up. If there’s one thing we’ve learned about coupling over the last fifty years it that nothing is better at slowing you down.

Hey, you can still use your favourite UI framework. You can still have your UI components any way you want them. The behavior of your application is just not coupled to those. That means you can change frameworks if that need ever happens. That means you can use the framework as a library, and **that is as much complexity** that is driving scarce value for the end user **that you don't have to handle** (e.g., context, hooks, reactive computations).

The net result is a productive development process resulting in **robust, maintainable, visually self-documented applications and components**. At near zero bundle cost. 

Did you get interested? There is a lot more to it. Let's [get you started](./installation.html).
