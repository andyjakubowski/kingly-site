---
title: Machine implementation
type: tutorials
order: 5
---

The password meter machine will be implemented with Kingly's `createStateMachine` factory. `createStateMachine` takes a machine definition and returns a function `pwdFsm` which accepts the specified machine inputs and outputs the commands to perform on the interfaced systems:

```
pwdFsm(typed 'a') = display ...
pwdFsm(typed '2') = display ...
pwdFsm(clicked submit) = submit `a2` password
```

The machine definition (passed as a first argument of the Kingly's machine factory) is mostly a translation of the previous graph into a data structure, together with the list of events accepted by the machine and the initial state of the machine:

{% tufte %}
Note that we defined in our implementation the content of the password field as event data for the `TYPED_CHAR` event instead of just the new character keyed in. This is a better choice as it accounts for keys that are not associated with visible characters, such as backspace.
{% endtufte %} 

```js
// The simplest update function possible :-)
function updateState(extendedState, extendedStateUpdates) {
  return extendedStateUpdates.slice(-1)[0];
}

const initialExtendedState = {
  input: ""
};
const states = {
  [INIT]: "",
  [STRONG]: "",
  [WEAK]: "",
  [DONE]: ""
};
const initialControlState = INIT;
const events = [TYPED_CHAR, CLICKED_SUBMIT, START];
const transitions = [
  { from: INIT, event: START, to: WEAK, action: displayInitScreen },
  { from: WEAK, event: CLICKED_SUBMIT, to: WEAK, action: NO_ACTIONS },
  {
    from: WEAK,
    event: TYPED_CHAR,
    guards: [
      { predicate: isPasswordWeak, to: WEAK, action: displayWeakScreen },
      { predicate: isPasswordStrong, to: STRONG, action: displayStrongScreen }
    ]
  },
  {
    from: STRONG,
    event: TYPED_CHAR,
    guards: [
      { predicate: isPasswordWeak, to: WEAK, action: displayWeakScreen },
      { predicate: isPasswordStrong, to: STRONG, action: displayStrongScreen }
    ]
  },
  {
    from: STRONG,
    event: CLICKED_SUBMIT,
    to: DONE,
    action: displaySubmittedPassword
  }
];

const pwdFsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events,
  transitions,
  updateState
};

const pwdFsm = createStateMachine(pwdFsmDef);
```


{% ptip %}
Kingly allows you to pick your favorite representation and manipulation of state by configuring the property *updateState*. All extended state updates for the machine will be run through the *updateState* function. In this simple example, we use simple cloning. You may use any reducer you fancy. I have used in the past [JSON patch](http://jsonpatch.com/), `Immer`  and `Object.assign` but whatever function which takes a state, and produces a new state from a list of state updates will work.
{% endptip %}

You can try the interactive demo in the following playground:
<iframe src="https://codesandbox.io/embed/6y3zj?fontsize=12&hidenavigation=1" title="Counter app" style="width:1000px; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

The demo creates the same machine but with the `console` and `devTool` properties set (second parameter of the `createStateMachine` factory). These optional settings are very useful when developing a machine to trace and inspect its computation. The playground will not allow you to see the devtool, but you will be able to pass inputs to the machine `pwdFsm` and observe the logs generated in the console. To see the dev tool, you need to [install the devtool extension](https://brucou.github.io/documentation/v1/tooling/devtool.html), run the playground in a separate window (click on *open sandbox*), open the console (F12), and navigate to the *Courtesan* tab: you can now run commands in the console and observe the results on the dev tool.

Alright, let's open the console then, run a series of inputs through the machine with the devtool on and see what we get. We logged here the results observed:

{% fullwidth %}
| Shell command |Devtool shows|Machine output|
|:---|:---|:---|
|`pwdFsm()`| error message |null|
|`pwdFsm({})`| warning message |null|
|`pwdFsm({rqwe: 314})`| warning message  |null|
|`pwdFsm({START:void 0})`| output,  machine state|[{command:"RENDER", params:{props: undefined, screen: "INIT_SCREEN"}}]|
|`pwdFsm({CLICKED_SUBMIT:void 0})`| warning message   |null|
|`pwdFsm({CLICKED_SUBMIT:void 0})`| warning message   |null|
|`pwdFsm({pwdFsm({TYPED_CHAR:'a'})})`| output,  machine state |[{command:"RENDER", params:{props: "a", screen: "RED_INPUT"}}]|
|`pwdFsm({CLICKED_SUBMIT:void 0})`| warning message |null|
|`pwdFsm({pwdFsm({TYPED_CHAR:'a2'})})`| output,  machine state |[{command:"RENDER", params:{props: "a2", screen: "GREEN_INPUT"}}]|
|`pwdFsm({CLICKED_SUBMIT:void 0})`| output,  machine state |[{command:"RENDER", params:{props: "a2", screen: "SUBMITTED_PASSWORD"}}]|
{% endfullwidth %}

If you do not have the dev tool installed, here is a quick video showing the dev tool in action:
![Imgur](https://imgur.com/qjqttZC.png)

You can already gather some of the machine semantics:
- if the machine receives a malformed input it returns an error object (and logs an error message in the console and the dev tool)
- if the machine receives an input for which there are no transitions configured, it returns null (and logs a warning message in the console and the dev tool)


## API dive
This section will go deeper into details of the `createStateMachine` API. Feel free to skip it and come back to it later if you are more interested in having a quick overview.

We mentioned previously that our machine is a graph whose edges are mapped to a triple of the form `event [condition] / actions`, and which is encoded in a machine definition object accepted by the `createStateMachine` factory. Let's assume `fsm = createStateMachine(fsmDef)`, where `fsmDef` is the machine definition -- an object, and `fsm` the actual executable machine -- a stateful function.

In the machine definition, events are strings containing the name or moniker for a given event. Events can also carry data. The `fsm` will be called with inputs/events as follows: `fsm([eventName]: eventData)` and return an array of commands if any.

The `condition` portion of the triple corresponds in the machine definition to a predicate, called a **guard**, which will compute a boolean from the received event data, and the extended state of the machine. Thereafter follows the guards used in the password meter example:

```js
// Guards
function isPasswordStrong(extendedState, eventData) {
  return hasLetters(eventData) && hasNumbers(eventData);
}

function isPasswordWeak(extendedState, eventData) {
  return !isPasswordStrong(extendedState, eventData);
}

function hasLetters(str) {
  return str.match(/[a-z]/i);
}

function hasNumbers(str) {
  return /\d/.test(str);
}

```

The `actions` portion of the triple corresponds in the machine definition to a function (which I termed for now *action factory*) whose concern is to compute the updates to perform on the extended state of the machine, and the outputs (i.e. commands) to return to the machine caller:

```js
function displayInitScreen() {
  return {
    updates: NO_STATE_UPDATE,
    outputs: [{ command: RENDER, params: { screen: INIT_SCREEN, props: void 0 } }]
  };
}

function displayWeakScreen(extendedState, eventData) {
  return {
    updates: [{ input: eventData }],
    outputs: [
      { command: RENDER, params: { screen: RED_INPUT, props: eventData } }
    ]
  };
}

function displayStrongScreen(extendedState, eventData) {
  return {
    updates: [{ input: eventData }],
    outputs: [
      { command: RENDER, params: { screen: GREEN_INPUT, props: eventData } }
    ]
  };
}

function displaySubmittedPassword(extendedState, eventData) {
  const password = extendedState.input;
  return {
    updates: NO_STATE_UPDATE,
    outputs: [
      {
        command: RENDER,
        params: { screen: SUBMITTED_PASSWORD, props: password }
      }
    ]
  };
}
```

As shown in the previous code:
- `outputs` is an array of commands of the shape `{command:String, params:*}`.
- updates is an array of state updates. The form of those state updates is that expected by the `updateState` reducer which will *in fine* perform the extended state update. Here we choose a trivial updater which simply replaces the current state with the new state:

```js
// The simplest update function possible :-)
function updateState(extendedState, extendedStateUpdates) {
  return extendedStateUpdates.slice(-1)[0];
}
```

