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

The machine definition in argument of the Kingly's machine factory is mostly a translation of the previous graph into a data structure, together with the list of events accepted by the machine and the initial state of the machine:

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
Kingly allows you to pick your favorite representation and manipulation of state by configuring the property *updateState*. All extended state updates for the machine will be run through the *updateState* function. In this simple example, we use simple cloning. You may use reducers, json patch, `Immer`, or whatever function which takes a state, and produce a new state from a list of state updates.
{% endptip %}

You can try the interactive demo in the following playground:
<iframe src="https://stackblitz.com/edit/js-xmybfo?embed=1&file=index.js&hideNavigation=1&view=preview" title="password-meter-nanomorph" style="width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Open the console, pass inputs to the `pwdFsm` machine, and observe the log messages to follow the evolution of the machine state:

{% tufte %}
Note that we defined in our implementation the content of the password field as event data for the `TYPED_CHAR` event instead of just the new character keyed in. This is a better choice as it accounts for keys which are not associated to visible characters, such as backspace.
{% endtufte %} 

```bash
# Events not configured in the machine
pwdFsm({rqwe: 314});
// > null
pwdFsm({START:void 0})
// > [{command:"RENDER", params:{props: undefined, screen: "INIT_SCREEN"}}]
pwdFsm({CLICKED_SUBMIT:void 0})
// > null
pwdFsm({CLICKED_SUBMIT:void 0})
// > null
pwdFsm({TYPED_CHAR:'a'})
// > [{command:"RENDER", params:{props: "a", screen: "RED_INPUT"}}]
pwdFsm({CLICKED_SUBMIT:void 0})
// > null
pwdFsm({TYPED_CHAR:'a2'})
// > [{command:"RENDER", params:{props: "a2", screen: "GREEN_INPUT"}}]
pwdFsm({CLICKED_SUBMIT:void 0})
// > [{command:"RENDER", params:{props: "a2", screen: "SUBMITTED_PASSWORD"}}]
```

## API dive
This section will go deeper on details of the `createStateMachine` API. Feel free to skip it and come back to it later if you are more interested in having a quick overview.

We mentioned previously that our machine is a graph whose edges are mapped to a triple of the form `event [condition] / actions`, and which is encoded in a machine definition object accepted by the `createStateMachine` factory. Let's assume `fsm = createStateMachine(fsmDef)`, where `fsmDef` is the machine definition -- an object, and `fsm` the actual executable machine -- a stateful function.

In the machine definition, events are strings containing the name or moniker for a given event. Events can also carry data. The `fsm` will be called with inputs/events as follows: `fsm([eventName]: eventData)` and return and array of commands if any.

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
- updates is an array of state updates. The form of those state updates is that expected by the `updateState` reducer which will *in fine* perform the extended state update. Here we choose a trivial updater which simply replaces the current state by the new state:

```js
// The simplest update function possible :-)
function updateState(extendedState, extendedStateUpdates) {
  return extendedStateUpdates.slice(-1)[0];
}
```

