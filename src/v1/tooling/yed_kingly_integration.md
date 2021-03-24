---
title: Integration with Kingly
type: tooling
order: 2
---

You do want to use yEd to create Kingly state machines. As simple and minimal as Kingly API strives to be, crafting and maintaining a large state machine by hand can involve repetitive tasks, tasks that a textual encoding supports poorly (e.g., refactoring transitions). Modeling is an iterative process and you want fast iterations. You want tooling that supports that. So what tools do you have at your disposal?

You have a professional, intuitive graph editor. You can model state machines by drawing them in that editor. When done, you save the graph in the native yEd `.graphml` format. To turn the drawing into an actual machine that you can run in a program, you then have two options:
 - use the `yed2kingly` CLI; or
 - use the `slim` CLI. 

Why two separate CLIs? What are the differences between the two? `yed2kingly` fits well with development workflows; produces files that are easier to debug; and allows using the Kingly's devtool extension. On the other hand, the `slim` command has optimizations that makes it more fit to production; it produces file with a smaller size (most machines you will write will fit between 0.5 and 2.5KB). Both CLIs will produce JavaScript files that can be imported/required by other modules of the application. Those files export factories that create Kingly machines.

This section will focus on the `yed2kingly` command. We start by reviewing in detail the end-to-end implementation workflow that the command supports. We then explain how to install and use the CLI.

## From a drawing to a programming function
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

The produced JavaScript files import/require the Kingly library, and export a machine factory that can be used by other modules to construct the actual JavaScript machine we seek. The machine factory must be passed as parameters the following pieces of information that are missing from the graph:
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

## Troubleshooting
The converter exits with an error code if it does not recognize a valid `yEd` graph, or if that graph cannot be converted to a valid Kingly machine.

**TODO: organize better, especially the tutorial, maybe move it here? to think about.**

## Rules
Some definitions:
  - A top-level initial transition is that initial transition which does not have any parent node

- yed2kingly rules:
  - There cannot be an action in the (unique by construction) top-level initial transition. There may be guards.

## Examples
There are plenty of graph examples in the [test directory](https://github.com/brucou/yed2kingly/tree/master/tests/graphs). An example, extracted from the tests directory and involving compound states and history pseudo-states is as follows:

![example of yed graph with history pseudo-state and compound state](https://imgur.com/VjKaIkL.png)

Running the `yed2kingly` script produces the following JavaScript file:

```js
// Copy-paste help
// For debugging purposes, functions should all have a name
// Using natural language sentences in the graph is valid
// However, you will have to find a valid JavaScript name for the matching function
// -----Guards------
// const guards = {
// };
// -----Actions------
// const actions = {
//   "logGroup1toH": function (){},,,
//   "logBtoC": function (){},,
//   "logBtoD": function (){},,
//   "logCtoD": function (){},,
//   "logGroup1toD": function (){},,
//   "logGroup1toC": function (){},,
//   "logDtoD": function (){},
// };
// ----------------
function contains(as, bs) {
  return as.every(function (a) {
    return bs.indexOf(a) > -1;
  });
}
var NO_OUTPUT = null;
var NO_STATE_UPDATE = [];
var events = ["event3", "event2", "event1"];
var states = {
  n1ღE: "",
  "n2ღGroup 1": { "n2::n0ღB": "", "n2::n1ღC": "", "n2::n2ღGroup 1": { "n2::n2::n0ღD": "", "n2::n2::n2ღD": "" } },
};
function getKinglyTransitions(record) {
  var aF = record.actionFactories;
  var guards = record.guards;
  var actionList = [
    "logGroup1toH",
    "ACTION_IDENTITY",
    "logBtoC",
    "logBtoD",
    "logCtoD",
    "logGroup1toD",
    "logGroup1toC",
    "logDtoD",
  ];
  var predicateList = [];
  aF["ACTION_IDENTITY"] = function ACTION_IDENTITY() {
    return {
      outputs: NO_OUTPUT,
      updates: NO_STATE_UPDATE,
    };
  };
  if (!contains(actionList, Object.keys(aF))) {
    console.error({ actionFactories: Object.keys(aF), actionList });
    throw new Error("Some action are missing either in the graph, or in the action implementation object!");
  }
  if (!contains(predicateList, Object.keys(guards))) {
    console.error({ guards: Object.keys(guards), predicateList });
    throw new Error("Some guards are missing either in the graph, or in the guard implementation object!");
  }
  const transitions = [
    { from: "n2ღGroup 1", event: "event3", to: "n1ღE", action: aF["logGroup1toH"] },
    { from: "n1ღE", event: "", to: { shallow: "n2ღGroup 1" }, action: aF["ACTION_IDENTITY"] },
    { from: "nok", event: "init", to: "n2::n0ღB", action: aF["ACTION_IDENTITY"] },
    { from: "n2::n0ღB", event: "event2", to: "n2::n1ღC", action: aF["logBtoC"] },
    { from: "n2::n0ღB", event: "event1", to: "n2::n2::n2ღD", action: aF["logBtoD"] },
    { from: "n2::n1ღC", event: "", to: "n2::n2::n0ღD", action: aF["logCtoD"] },
    { from: "n2::n2ღGroup 1", event: "init", to: "n2::n2::n0ღD", action: aF["logGroup1toD"] },
    { from: "n2ღGroup 1", event: "init", to: "n2::n1ღC", action: aF["logGroup1toC"] },
    { from: "n2::n2::n2ღD", event: "event1", to: "n2::n2::n0ღD", action: aF["logDtoD"] },
  ];

  return transitions;
}

export { events, states, getKinglyTransitions };

```

The exported events, states, getKinglyTransitions can then be used in a regular JavaScript file as follows:

```js
    import {createStateMachine} from 'kingly';
    import {events, states, getKinglyTransitions} from 'tests/graphs/hierarchy-history-H.graphml.fsm.js';
(...)

    const guards = {};
    const actionFactories = {
      logGroup1toC: (s, e, stg) => traceTransition('Group1 -> C'),
      logBtoC: (s, e, stg) => traceTransition('B -> C'),
      logBtoD: (s, e, stg) => traceTransition('B -> D'),
      logCtoD: (s, e, stg) => traceTransition('C -> D'),
      logDtoGroup1H: (s, e, stg) => traceTransition('D -> Group1H'),
    };
    const fsmDef = {
      // NOTE: updateState and initialExtendedState are provided by the user
      updateState,
      initialExtendedState,
      events,
      states,
      transitions: getKinglyTransitions({ actionFactories, guards }),
    };
    const fsm = createStateMachine(fsmDef, settings);

``` 


### Final note
This process was chosen after plenty of reflection of pondering over what was the best approach for this functionality. A Babel plugin or macro was a possibility but the level of complexity was much higher -- both from a macro creator and a macro user perspective, and the predictable requirements in terms of maintenance were also appreciable. The retained solution is to produce the outputs of the file conversion in a separate, independent JavaScript file. There is thus no necessity to write proprietary JavaScript, it is programming as usual.

This is a first version based on personal usage. Comments and recommendations are welcome if you have them about a better way to handle the integration of a graph editor with Kingly JavaScript library. Feel free to open an issue.

<## How does it work?
In a typical process, I start designing a machine from the specifications by drawing it in the yEd editor. When I am done or ready to test the results of my design, I save the file. yEd by default saves its files in a `.graphml` format. I save the graphml file in the same directory in which I want to use the created state machine. From there, a previously launched watcher runs the `yed2kingly` node script on the newly saved file and generates a JavaScript file that exports the events, state hierarchy, and transitions contained in the graph -- you can of course also run the script manually instead of using a watcher. The provided `exports` can then be used as parameters to create a Kingly state machine.>

