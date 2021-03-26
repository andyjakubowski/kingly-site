---
title: Integration with Kingly
type: tooling
order: 2
---

For anything serious, you do want to use yEd to create Kingly state machines. As simple and minimal as Kingly API strives to be, crafting and maintaining a large state machine by hand can involve repetitive tasks, tasks that a textual encoding supports poorly (e.g., refactoring transitions). Modeling is an iterative process and you want fast iterations. You want tooling that supports that. So what tools do you have at your disposal?

You have a professional, intuitive graph editor. You can model state machines by drawing them in that editor. When done, you save the graph in the native yEd `.graphml` format. To turn the drawing into an actual machine that you can run in a program, you then have two options:
 - use the `yed2kingly` CLI; or
 - use the `slim` CLI. 

Why two separate CLIs? How do they differ? `yed2kingly` fits well with development workflows; produces files that are easier to debug; and allows using the Kingly's devtool extension. On the other hand, the `slim` command has optimizations that makes it more fit to production; it produces files with a smaller size (most machines you will write will fit between 0.5 and 2.5KB). Both CLIs will produce JavaScript files that can be imported/required by other modules of the application. Those files export factories that create Kingly machines.

This section will focus on the `yed2kingly` command. We start by reviewing in detail the end-to-end implementation workflow that the command supports. We then explain how to install and use the CLI.

## From a drawing to a JavaScript function
A Kingly state machine computes outputs as a result of being passed an input -- we will often say that the machine processes or receives an event. The high-level specifications of the machine computation can be represented with a graph. Nodes in the graph correspond to control states of the machine. Edges connecting two nodes represent transitions between control states of the machine.

We said specifications because the drawing let us know how the machine will compute in response to an input depending on the state it is in. We said high-level specifications because the drawing does not allow the actual computing of a machine response -- it is a drawing. Let's look at a [simple such drawing from the tutorials](https://brucou.github.io/documentation/v1/tutorials/counter-application.html):

![simple machine](https://brucou.github.io/documentation/graphs/trivial%20counter%20machine.png)

This **machine drawing** tells us that when processing a *click* input, the modeled **JavaScript machine** should trigger the incrementing of a counter, and some rendering. It does not tell us how exactly that works. To turn the drawing into an actual JavaScript function, you need to provide the missing JavaScript objects: 
- implementation of *increment counter*; and
- implementation of *render*.

The `.graphml` file contains the following pieces of information:
- the inputs (events) that are accepted by the machine;
- the machine's initial control state;
- the control states of the machine;
- the hierarchy of the machine; and
- the machine's transitions.

The `yed2kingly` CLI extracts the pieces of information contained in the `.graphml` file that it receives as a parameter and produces two almost identical JavaScript files. One is destined to be used in a browser context (`.js` file), the other in a Node.js context (`.cjs` file that can be `require`d but not `import`ed).

The produced JavaScript files import/require the Kingly library, and export a machine factory that can be used by other modules to construct the actual JavaScript machine we seek. The machine factory must be passed the following pieces of information that are missing from the graph:
- the machine's initial extended state;
- the implementation for the machine guards, if any -- we only have their names;
- the implementation for the machine actions, if any -- we only have their names;
- the implementation of how the machine updates its internal state (`updateState` parameter); and
- the machine's optional configuration -- e.g., debugging, tracing, dependency injection.

You are invited to review the [*Password meter* tutorial](https://brucou.github.io/documentation/v1/tutorials/password-meter-using-graph-editor.html) for a guided example of turning a machine drawing into a JavaScript machine with `yed2kingly`.

## Get started
If you haven't yet installed the `yEd` editor, please do so by following the instructions [here](https://brucou.github.io/documentation/v1/tooling/graph_editing.html).

To use  `yed2kingly`  in the shell terminal, you will need to install the package globally:

```bash
npm install -g yed2kingly
```

## Usage
```bash
yed2kingly filename.graphml
```

Running the converter produces two files, targeted at consumption in a browser and Node.js environment. Assuming the file `src/graphs/file.graphml` is passed to `yed2kingly`, the following two files are created: `src/graphs/file.graphml.fsm.js`, and `src/graphs/file.graphml.fsm.cjs`.

## Examples
There are plenty of graph examples in the [test directory](https://github.com/brucou/yed2kingly/tree/master/tests/graphs). One such example involving compound states and history pseudo-states is as follows:

![example of yed graph with history pseudo-state and compound state](https://imgur.com/VjKaIkL.png)

Running the `yed2kingly` script produces a JavaScript file that exports a `createStateMachineFromGraph` machine factory:

```js
import { createStateMachine } from "kingly";

// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns Boolean
 */
// const guards = {
//   "can move &amp;&amp; won": function (){},
//   "can move &amp;&amp; !won": function (){},
//   "white piece": function (){},
//   "black piece": function (){},
//   "&gt;0 moves": function (){},
// };
// -----Actions------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns {{updates: U[], outputs: O[]}}
 * (such that updateState:: E -> U[] -> E)
 */
// const actions = {
//   "update clock": function (){},
//   "cancel timer": function (){},
//   "Move": function (){},
//   "restart timer": function (){},
//   "Undo": function (){},
//   "reset and start clock": function (){},
// };
// ----------------

...

var events = ["clock ticked", "paused", "click", "resume", "Undo"];

...

function createStateMachineFromGraph(fsmDefForCompile, settings) {
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  var transitions = getKinglyTransitions({
    actionFactories: fsmDefForCompile.actionFactories,
    guards: fsmDefForCompile.guards,
  });

  var fsm = createStateMachine(
    {
      updateState,
      initialExtendedState,
      states,
      events,
      transitions,
    },
    settings
  );

  return fsm;
}

export { createStateMachineFromGraph, ... };

```

The exported `createStateMachineFromGraph` factory can then be used in a regular JavaScript file as follows:

```js
    import {createStateMachineFromGraph} from 'tests/graphs/hierarchy-history-H.graphml.fsm.js';
(...)

    const guards = ...;
    const actionFactories = {
     "update clock": ...,
     "cancel timer": ...,
     "Move": ...,
     "restart timer": ...,
     "Undo": ...,
     "reset and start clock": ...,
    };
    const fsmDef = {
      // NOTE: updateState and initialExtendedState are provided by the user
      updateState,
      initialExtendedState,
      guards,
      actionFactories
    };
    const fsm = createStateMachineFromGraph(fsmDef, settings);

```


## Tips
- You can use the shortened `y2k` instead of `yed2kingly`.
- You can have a file watcher in development that automatically runs `yed2kingly` when a `.graphml` file changes. The script will thus run every time you save the graph that you are working on.
- the produced files include commented pieces of code that you can copy paste to speed up your implementation and reduce the possibility of errors. For instance, in the previous example, you need to provide a map of action names to action factories. You can copy-paste, uncomment, and complete the following commented code:
```js
// const actions = {
//   "update clock": function (){},
//   "cancel timer": function (){},
//   "Move": function (){},
//   "restart timer": function (){},
//   "Undo": function (){},
//   "reset and start clock": function (){},
// };
```
- Preferably use named functions for any action factories and guards. You will get friendlier logs in the dev console.

## Troubleshooting
The script will exit with an error code whenever:
- there are syntax errors in the yEd graph (e.g., forbidden or ambiguous edge label syntax). You may want to review the [detailed syntax reference](http://localhost:4000/documentation/v1/tooling/graph_editing.html#Syntax-reference). You can paste the [grammar](https://github.com/brucou/slim/blob/master/yedEdgeLabelGrammar.ne) in the [Nearley parser playground](https://omrelli.ug/nearley-playground/) and check your syntax.
- there are semantic errors in the yEd graph. That means that your drawing is legit, but it does not map to a valid Kingly machine. This may happen when you break Kingly contracts, for instance, if you have two initial control states for the same compound state. You may want to review [Kingly contracts](http://localhost:4000/documentation/v1/api/index.html#Contracts).
- the script cannot parse the file. You may want to check that you wrote the filename correctly, that the file exists at the expected location, and that the file is a valid `.graphml` file by opening it in yEd.
- there is a bug! In that case, please [open an issue on Github](https://github.com/brucou/kingly/issues).

## Feedback welcome!
Kingly tooling exist to address pain points from real use cases, and drive your productivity up. Your feedback is welcome and may result in the improvement or extension of the existing set of tools. If there is anything you feel should be addressed and is not, or should be addressed differently, get in touch by [opening an issue on Github](https://github.com/brucou/kingly/issues).
