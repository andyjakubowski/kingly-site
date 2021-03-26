---
title:  Compiler
type: tooling
order: 3
is_new: true
---

The `slim` command supports the creation of state machines that are optimized for production. The Kingly state machine library may end up contributing between 5 and 12 KB of your production bundles. The `slim` compiler allows you to reduce further the footprint of your state machines by compiling away the Kingly library. Real-life, large machines compile to ~2 KB size. Additionally, the compiled code is plain, zero-dependency JavaScript that will work in older browsers (IE > 8).

The `slim` compiling command is designed to work with and complement the [yed graph editor](https://www.yworks.com/products/yed-live). You may find more information on yEd in the *Graph editor* section of this documentation.

`slim` takes a `.grapml` yEd file as input and outputs JavaScript files that define and export a state machine factory function. Developers can then import the machine factory function in their program and create a Kingly state machine by calling the factory with the required parameters.

You are invited to review the [*Password meter* tutorial](https://brucou.github.io/documentation/v1/tutorials/password-meter-compiling.html) for a guided example of turning a machine drawing into a JavaScript function with `slim`.

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

The `slim` CLI extracts the pieces of information contained in the `.graphml` file that it receives as a parameter and produces two almost identical JavaScript files. One is destined to be used in a browser context (`.js` file), the other in a Node.js context (`.cjs` file that can be `require`d but not `import`ed).

The produced JavaScript files import/require the Kingly library, and export a machine factory that can be used by other modules to construct the actual JavaScript machine we seek. The machine factory must be passed the following pieces of information that are missing from the graph:
- the machine's initial extended state;
- the implementation for the machine guards, if any -- we only have their names;
- the implementation for the machine actions, if any -- we only have their names;
- the implementation of how the machine updates its internal state (`updateState` parameter); and
- the machine's optional configuration -- e.g., debugging, tracing, dependency injection.

You are invited to review the [*Password meter* tutorial](https://brucou.github.io/documentation/v1/tutorials/password-meter-using-graph-editor.html) for a guided example of turning a machine drawing into a JavaScript machine with `yed2kingly`.

## How does it work?
In a typical process, you draw a machine with the yEd editor. When done or ready to test, you save the file in the default `.graphml` format in the same directory in which you want to use the target state machine. You run the `slim` command on the newly saved file. That generates the compiled JavaScript file which exports a machine factory function. The factory is passed parameters to create a Kingly state machine.

## Get started
If you haven't yet installed the `yEd` editor, please do so by following the instructions [here](https://brucou.github.io/documentation/v1/tooling/graph_editing.html).

To use  `slim`  in the shell terminal, you will need to install the package globally:

```bash
npm install -g slim
```

## Usage
```bash
slim filename.graphml
```

Running the converter produces two files, targeted at consumption in a browser and Node.js environment. Assuming the file `src/graphs/file.graphml` is passed to `slim`, the following two files are created: `src/graphs/file.graphml.fsm.compiled.js`, and `src/graphs/file.graphml.fsm.compiled.cjs`.

## Examples
The following machine graph:

![top-level-init test graph](https://imgur.com/SWWMdGb.png)

when compiled with `slim` leads to the following JavaScript file:

```js
// Generated automatically by Kingly, version 0.29
// http://github.com/brucou/Kingly
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
//   "isNumber": function (extendedState, eventData, settings){},
//   "not(isNumber)": function (extendedState, eventData, settings){},
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
//   "logNumber": function (extendedState, eventData, settings){},
//   "logOther": function (extendedState, eventData, settings){},
// };
// -------Control states---------
/*
      {"0":"nok","1":"Numberღn0","2":"Otherღn2","3":"Doneღn3"}
      */
// ------------------------------

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;

  var eventHandlers = [
    ...
  ];

  function process(event) {
    ...
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

export { createStateMachine };

```


Let's illustrate the parameters received by the `createStateMachine` factory function:

```js
    // require the js file
    const { createStateMachine } = require(`${graphMlFile}.fsm.compiled.cjs`);

    // Build the machine
    const guards = {
      'not(isNumber)': (s, e, stg) => typeof s.n !== 'number',
      isNumber: (s, e, stg) => typeof s.n === 'number',
    };
    const actionFactories = {
      logOther: (s, e, stg) => ({ outputs: [`logOther run on ${s.n}`], updates: {} }),
      logNumber: (s, e, stg) => ({ outputs: [`logNumber run on ${s.n}`], updates: {} }),
    };
    const fsm1 = createStateMachine({
      initialExtendedState: { n: 0 },
      actionFactories,
      guards,
      updateState,
    }, settings);
```

As the example illustrates, the factory function's first parameter consists of four objects: 
- the initial extended state of the machine; 
- the mapping between the action factories name and their JavaScript implementation;
- the mapping between the guards name and their JavaScript implementation; and
- a reducer function `updateState` whose parameters are a state value and an array of state updates operations. The reducer function return an updated state value. 

Note that the compiled machine does not offer error messages, protection against malformed inputs, devtool support, or logging functionality. This is only possible when using the Kingly library -- and its extra kilobytes.

Note also that, as much as possible, `slim` refrains from using advanced JavaScript language features in the generated code to be compatible with older browsers without polyfilling or babel-parsing. This, however, has not been thoroughly tested so far.

You will find additional examples in the [`/tests` directory](https://github.com/brucou/slim/tree/master/tests) of the `slim` Github repository.

## Tips
- You can have a file watcher in development that automatically runs `slim` when a `.graphml` file changes. The script will thus run every time you save the graph that you are working on.
- the produced files include commented pieces of code that you can copy paste to speed up your implementation and reduce the possibility of errors. For instance, in the previous example, you need to provide a map of action names to action factories. You can copy-paste, uncomment, and complete the following commented code:
```js
// const actions = {
//   "logNumber": function (extendedState, eventData, settings){},
//   "logOther": function (extendedState, eventData, settings){},
// };
```

## Size of the generated file
This section contains rather technical considerations that do not impact your usage of Kingly or its tooling. Feel free to skip if you have more pressing matters to consider.

Assuming the machine has no isolated states (i.e. states which are not reached by any transitions), the size of the compiled file roughly follows the shape `a + b x Number of transitions`, i.e. is mostly proportional to the number of transitions of the graph. The proportional coefficient `b` seems to be fairly low and the compression factor increases with the size of the machine. In short, you need to write a really large graph to get to 5Kb just for the machine.

{% tufte %}
Minification is performed online with the [javascript-minifier](https://javascript-minifier.com/) tool. Lines of code are counted with an [online tool](https://codetabs.com/count-loc/count-loc-online.html). 
{% endtufte %}

We give a few data points: 
 
 |Machine graph|Machine graph size|Compiled machine size |
 |---|---|---|
|![counter machine graph](https://imgur.com/mk9hM6u.png)|1 control state, 1 transition| ~50 loc, 0.5 KB|
|![[password meter modelization]](https://brucou.github.io/documentation/graphs/password-meter.png)|4 control state, 5 transitions| ~80 loc, 0.6 KB|
|[![Conduit average-sized application](https://brucou.github.io/documentation/graphs/real-world/realworld-routing-article.png)](https://rw-kingly-svelte.bricoi1.now.sh/#/)|~35 control states, 75 transitions| ~2.3 KB|

We estimate that writing logic by hand for average-size machines may shave 100 (extra code due to the compiler) + 400 bytes (extra code due to using a graph editor) for a total of 0.5 KB.

{% tufte %}
Note that this size does not (and cannot) include the actions and guards but does represent the size of the logic encoded in the machine.
{% endtufte %}

Those preliminary results are fairly consistent. Assuming 20 bytes per transitions (computed from the previous data points), with a baseline of 500 bytes, to reach 5 KB (i.e. the size of the core Kingly library) we need a machine with over 200 transitions!! 

In summary, with the `slim` compiler, **Kingly proposes state machines as a near-zero-cost abstraction**. This means that if you would have written that logic by hand, you would not have been able to achieve a significantly improved min.gzipped size.

## Troubleshooting
The script will exit with an error code whenever:
- there are syntax errors in the yEd graph (e.g., forbidden or ambiguous edge label syntax). You may want to review the [detailed syntax reference](http://localhost:4000/documentation/v1/tooling/graph_editing.html#Syntax-reference). You can paste the [grammar](https://github.com/brucou/slim/blob/master/yedEdgeLabelGrammar.ne) in the [Nearley parser playground](https://omrelli.ug/nearley-playground/) and check your syntax.
- there are semantic errors in the yEd graph. That means that your drawing is legit, but it does not map to a valid Kingly machine. This may happen when you break Kingly contracts, for instance, if you have two initial control states for the same compound state. You may want to review [Kingly contracts](http://localhost:4000/documentation/v1/api/index.html#Contracts).
- the script cannot parse the file. You may want to check that you wrote the filename correctly, that the file exists at the expected location, and that the file is a valid `.graphml` file by opening it in yEd.
- there is a bug! In that case, please [open an issue on Github](https://github.com/brucou/kingly/issues).

## Known limitations
The `.graphml` format for yEd is not publicly documented. The specifications for the format have not changed in many years. However, our parser may still have holes or break if the format specifications change. It is thus important that you log issues if you encounter any errors while running the compiler. 

## Feedback welcome!
Kingly tooling exist to address pain points from real use cases, and drive your productivity up. Your feedback is welcome and may result in the improvement or extension of the existing set of tools. If there is anything you feel should be addressed and is not, or should be addressed differently, get in touch by [opening an issue on Github](https://github.com/brucou/kingly/issues).
