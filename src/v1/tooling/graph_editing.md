---
title: Graph editors
type: tooling
order: 1
is_new: true
---

## Graph editing with yEd
`yEd` is a fairly intuitive graph editor. Instructions on how to use it can be found online. A short video (90s) introduction to `yEd` features is as follows:

{% youtube OmSTwKw7dX4 %}

A longer and more practical introduction addressing basic editing of graphs with `yEd`:
 
{% youtube ujMhxPJnJCw %}

You will need to go to `yEd`'s website and download the editor to use on your desktop. You can also use `yEd live` which is the online version of the editor. In that case, you need not download anything, and can edit a graph entirely from the browser. I do recommend the desktop version though for continuous use.

In a typical graph editing session, the machine designer will use two types of shapes: one for pseudo-control-states, another one for regular control states. In accordance with conventions, I commonly use a round, small shape for initial control states origin node, and history states. For atomic control states, I use a rectangular shape. I leave the shape for compound control states to be the default offered by `yEd`. 

Shapes representing nodes can be linked with edges, which are entered by the user by clicking on the origin node of the edge, and dragging the mouse towards the destination node of the edge.  Edges can be edited by selecting them and pressing F2, or double-clicking on the edge. There are faster ways to do many node and edge handling which users will acquire once they get acquainted with the keyboard shortcuts. 

To create a compound control state, also called a group, simply create a node, select that node, then right-click, then click *Grouping* (or <kbd>Ctrl-Alt-G</kbd>). Once you have such a group, you can double click on it to enter that group and see only the contents of that group. You can navigate back up with the right menu *Grouping -> Previous view* or <kbd>Alt-Page-Up</kbd>. Groups can be collapsed or expanded (click on -/+ icon in the top-left corner of the compound node). 

One of the things that make `yEd` great is that you do not need to think about layouting the graph. Just add the nodes in random places, and focus on having the graph relations right. You can then use a large set of computer-generated layouts. The ones I use most commonly are the hierarchic layout, the orthogonal layout, the flowchart, and the BPMN layout. After playing a bit with the layouts, you will pick the one that expressees visually the best the relationship. Hierarchic layouts are for instance often useful when writing machines for user interfaces, because such machines often have a preferred direction, with a few dropbacks: the user progresses on a user flow, with occasionally returning to a previous stage of the flow (error, correcting inputs, etc.). Orthogonal layouts often use better the space, but do not display visually well graphs with expanded compound nodes. It takes only a few trials to get a sense of the layouts and their utility.

All layouts can be customized with an extensive suite of parameters (minimum distance between nodes, etc.). Layout option windows can be floated or docked (my favorite option). Once docked, running a layout consists only of clicking a play button. You will then see your graph visually morph into the selected layout. 

Most of the graphs on the current documentation site have been authored and laid out with `yEd`. An example graph is as follows:

  ![example of yed graph with history pseudo-state and compound state](https://imgur.com/VjKaIkL.png)

In the previous example, compound control states, i.e. nodes which contain other nodes, are represented in gray color. Pseudo-control-states are represented in dark orange color, while atomic control states, i.e. nodes which do not contain any other nodes are represented in yellow. There is no convention enforced for colors, nor for shapes, so feel free to pick the one you liked the most from the *Shape node* palette on the right (cf. video). 

In the next section, we will describe the `yed2kingly` utility script which supports converting a `yEd` graphml file containing nodes, edges, node labels and edge labels into a Kingly state machine.

## yed2kingly
### Motivation
The `yed2kingly` package aims at supporting the creation of state machines with the [Kingly state machine library](https://brucou.github.io/documentation/). While by design the Kingly configuration for state machines follows a simple and minimal syntax, crafting and maintaining a large state machine by hand can involve repetitive tasks. Such tasks include for instance looking up a transition and remove it, or checking that a new transition to add does not conflict with an existing one.
 
 Furthermore, a large machine is rarely written directly in a textual format but is rather supported by some kind of visualization whether hand-written graphs or professional graph editors. When switching to text editing, the visual information is lost, the text-based version eventually becomes desynchronized with the visualization. 

This is a case in hand where visual tooling can strengthen part of an error-prone manual process, and automate the repetitive tasks.

[yEd](https://www.yworks.com/products/yed) is a versatile professional graph editor that produces high-quality diagrams for a large set of use cases. yEd is not open source, however, there is no fee linked to its usage as an end-user. I have been using it for the past four years to generate all kinds of diagrams including state machine graphs. The key features that I found extremely valuable in this time are the accessibility to non-professional users (this is no photoshop), its large set of sophisticated automatic highly-customizable layouts, and its text-based versionable graphml format.

This makes yEd a valuable tool to use for state machine creation, edition and maintenance. yEd exists in desktop and online versions. I recommend strongly the desktop version on the grounds that it is more productive for serious tasks, but your mileage may vary. For educational or demonstration purposes, there may be educational value in the online version.

### How does it work?
In a typical process, I start designing a machine from the specifications by drawing it in the yEd editor. When I am done or ready to test the results of my design, I save the file. yEd by default saves its files in a `.graphml` format. I save the graphml file in the same directory in which I want to use the created state machine. From there, a previously launched watcher runs the `yed2kingly` node script on the newly saved file and generates a JavaScript file that exports the events, state hierarchy and transitions contained in the graph -- you can of course also run the script manually instead of using a watcher. The provided `exports` can then be used as parameters to create a Kingly state machine.

### Install
`npm install yed2kingly`

### Usage
```bash
yed2kingly file.graphml
```

Running the converter produces two files, targeted at consumption in a browser and node.js environment:

Before:
```bash
src/graphs/file.graphml
```

After:
```bash
src/graphs/file.graphml.fsm.js
src/graphs/file.graphml.fsm.cjs
```

The converter must emit an error or exit with an error code if the converted graph will not give rise to a valid Kingly machine (in particular cf. rules). The idea is to fail as early as possible.

The produced file export three objects: the events, state hierarchy and a transition factory. The first two objects can be used directly as parameters to create a Kingly machine, i.e. they follow the Kingly format. The transition factory requires the developer to associate a JavaScript function to any action and guard labels that is in the graph. The developer thus passed an object containing this information and is returned a Kingly transitions object. I provide an example which should clarify the expected syntax and usage.  

### Rules
Some definitions:
  - An initial transition is that which originates from a node whose label is `init`
  - A top-level initial transition is that initial transition which does not have any parent node
  - A history pseudo-state is a node whose label is H (shallow history) or H* (deep history)
  - A compound node is a node that is created in the yEd interface by using the group functionality (*Grouping > Group* or *Ctrl-Alt-G* in version 3.19).

- yed2kingly rules:
  - With the exception of history and init pseudo-states, all nodes are converted to Kingly states
  - The Kingly name for a compound state will be the label displayed in the yEd editor for the matching group nodes in a non-collapsed state. This is important as yEd has another name for group nodes in the collapsed state.
  - The label for any edge in the graph maps to a Kingly transition record. The chosen syntax is `event [guard] / action`. Anyone of the event, guard and action can be empty. Hence `[]/` is a valid syntax though not recommended.
  - There cannot be an action in the (unique by construction) top-level initial transition. There may be guards.
  - Labels **must not** include the reserved character `ღ`
  - you can use the exact same label for different nodes (I do so in some of the tests), however, beware that this may come and bite you when you are tracing or debugging
  - The action label cannot be the reserved label `ACTION_IDENTITY`
  - A label `x` must be so that the following JavaScript `{[x]: value}` is valid syntactically. This means labels can have spaces and a large set of Unicode characters, as allowed by the JavaScript specifications. Action labels such as *do this, do that* are thus valid.
  - edge labels (which contain the event/guard/action triple under the following syntax `event [guard] / action (comment)`) are parsed with an [EBNF grammar](https://github.com/brucou/slim/blob/master/yedEdgeLabelGrammar.ne). As of June 2020, to avoid having to handle an ambiguous grammar:
    - `event` cannot have the characters `[`, `]`, `/`, `,` and `|` 
    - `guard` cannot have the characters `[`, `]`, and `,`
    - `actions` cannot have the characters `[`, `]`, `/`, `,` `(`, `)`, and `|`
  - an edge label may encode several transitions, separated by `|`. All rules above apply to each of the transition as if it was alone
  - edge labels can encode multiple transitions, provided those transitions encoding are separated by the `|` (pipe) character:
    - e.g. `| event1 [guard1] / action1 | event2 [guard2] / action2` encodes two transitions triggered respectively by `event1` and `event2`
  - edge labels also encode composite guards and composite actions. Composite guards and actions are comma-separated actions. `guard1, guard2` encodes a guard which will be satisfied only and only if both `guard1` and `guard2` are satisfied. Similarly, `action1, action2` encode two actions that will be composed to form a single action. The outputs of the composed is the concatenation of the outputs of each action, in the same order
    - e.g. `event [cond1, cond2] / action1, action2 (comment)`


In short:

|Edge label| Valid|
|---|---|
|start / display initial screen | Yes |
|start / display / initial screen | No |
|typed [letters?] / display password| Yes |
|typed [!letters?] / | Yes |
|typed [!letters?]  | Yes |
| [!letters?]  | Yes |
| [!letters?] / display password | Yes |
| start | Yes |
| [] | Yes |
| / | Yes |
| [] / | Yes |
|   | Yes |
|  / display password | Yes |
|  成為   [或不]   / 成為 | Yes |
|  である[またはない] /である | Yes |
| &#124; start / display initial screen &#124; reset / navigate back| Yes, parses two transitions |
| &#124; start [letters? &#124; ] / display initial screen &#124; reset / navigate back| No |
| &#124; start [visible?, letters?] / display initial screen, navigate back| Yes |

We recommend to use the pipe character `|` exclusively and only to separate transitions. We recommend the comma `,` character exclusively to separate the components of a composite guard or action.

#### Language support
Unfortunately, as of today, only English and German are supported in the yed interface. However, all UTF-8 characters are accepted in the graphs that you can edit. The previous chinese and japanese characters have been copy/pasted into yed and are displayed fine. 

There is however an old issue (dating from 2015) that seems to indicate that it may not be possible to write the characters from a chinese/japanese keyboard. Please open an issue in the github directory if you encounter a problem.

Lastly, right-to-left, and vertical languages will not be displayed in the correct order. Shamefully, yed offers very little in terms of internationalization and localization.

### Conventions
The following conventions are not rules and are not enforced in any way. They exist for practicality or readability purposes.

- Nodes for machine states have a rectangular shape
- Init pseudo-states are represented by a small circle with a different color than regular nodes
- Compound states (group nodes in yEd terminology) should also be displayed in a third color 

### Examples
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

