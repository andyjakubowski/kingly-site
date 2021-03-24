---
title: Compiling the machine
type: tutorials
order: 8
is_new: true
---

In the previous sections, we specified, designed, and implemented a password meter through two methods. The first method consisted of writing the machine entirely by hand, through the Kingly library API. The second method involved drawing the machine with the yEd professional graph editor, then getting all the parameters we could from the drawing in order to feed the Kingly API. Those parameters included the hierarchy of states, the events, and identifiers of actions and guards. 

In this section, we are going to go one step further and bypass the Kingly library API entirely. We will compile the exact same drawing (`.graphml` file) into a standard, plain JavaScript function that will have the exact same specifications as the drawn machine.

Equipped with the compiler, developers no longer need to pay the cost of the library. Current measurements indicate that most machines will be under 1KB, and large machines (e.g. ~50 transitions) will be around 2KB. Through its compiler, Kingly essentially provides state machines as a zero-cost abstraction.

## Install the compiler
As of now, the compiler is called `slim` and is installed with `npm`:

```bash
npm install -g slim
```

This should install the compiler globally, so you can run the `slim` script in the terminal.

You can refer to the [compiler's documentation](https://brucou.github.io/documentation/v1/tooling/compiling.html) for more details. In this tutorial, only the required information for the execution of this tutorial will be presented.

## Compiling
In the previous section, we saved a `password-meter.graphml` file. Run the compiler, passing the location of that file as a parameter will create two compiled files: a `.cjs` file (for Node environments) and a `.js` file (for consumption in the browser). 

```bash
slim password-meter.graphml
```

We will use the `.js` file ([`password-meter.fsm.compiled.js`](https://github.com/brucou/slim/blob/master/tests/graphs/password-meter.graphml.fsm.compiled.js)).

The compiled file is as follows (as of v0.6.0):

```js
function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var cs = "nok";
  var es = initialExtendedState;

  var eventHandlers = {
    n4ღidle: {
      start: function (es, ed, stg) {
        let computed = actions["display initial screen"](es, ed, stg);
        cs = "n3ღweak";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n3ღweak: {
      typed: function (es, ed, stg) {
        let computed = null;
        if (guards["!letter and numbers?"](es, ed, stg)) {
          computed = actions["display weak password screen"](es, ed, stg);
          cs = "n3ღweak";
        } else if (guards["letter and numbers?"](es, ed, stg)) {
          computed = actions["display strong password screen"](es, ed, stg);
          cs = "n2ღstrong";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    n2ღstrong: {
      typed: function (es, ed, stg) {
        let computed = null;
        if (guards["letter and numbers?"](es, ed, stg)) {
          computed = actions["display strong password screen"](es, ed, stg);
          cs = "n2ღstrong";
        } else if (guards["!letter and numbers?"](es, ed, stg)) {
          computed = actions["display weak password screen"](es, ed, stg);
          cs = "n3ღweak";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
      "clicked submit": function (es, ed, stg) {
        let computed = actions["display password submitted screen"](es, ed, stg);
        cs = "n1ღdone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    nok: {
      init: function (es, ed, stg) {
        cs = "n4ღidle"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
  };

  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      // If transition, but no guards fulfilled => null, else => computed outputs
      return computed === null ? null : computed.outputs;
    }
    // Event is not accepted by the machine
    else return null;
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

export { createStateMachine };

```

As is visible from this code, the compiled file exports a machine factory, with the same name as Kingly's machine factory. The arguments of that factory are however different. There is no longer a need to pass the initial control state, the transitions, the state hierarchy, and the events of the machine: all of that was taken from the `.graphml` and compiled away. We however still need to pass the information that was not available in the graph, such as the initial extended state, the `updateState` reducer, the settings to inject in the machine, and the binding of actions and guards to JavaScript functions.

{% tufte %}
The settings for the compiler `createStateMachine` factory no longer make provisions for logging and tracing capabilities. They can thus only be used to pass constants to the machine or to inject dependencies so the machine always computes with pure functions without the necessity of introducing closures.
{% endtufte %}


The machine is thus now created as follows:

```js
(...)
  const pwdFsmDef = {
    initialExtendedState,
    actionFactories: actions,
    guards,
    updateState
  };
(...)

createStateMachine(pwdFsmDef, {});
```

The full machine implementation can be accessed in the playground: 

<iframe src="https://codesandbox.io/embed/f47nx?fontsize=12&hidenavigation=1" title="Counter app" style="width:1000px; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
 
To check that our machine still works as before, we can repeat the same tests and check the results. We no longer have the devtool available this time, but we can still check the outputs of the machine to verify its good behavior.
 
 You can open the console tab, and check that the `pwdFsm` is available in the `window` object. You can then run the following series of commands:

{% fullwidth %}
|Command| Expecetd results|
|:----|:----|
|`pwdFsm()` | Type Error! |
|`pwdFsm({})` | null |
|`pwdFsm({rqwe: 314})` | null |
|`pwdFsm({"start": void 0})` | [{command:”RENDER”, params:{props: undefined, screen: “INIT_SCREEN”}}] |
|`pwdFsm({"clicked submit":void 0})` | null |
|`pwdFsm({"clicked submit":void 0})` | null |
|`pwdFsm({"typed":'a'})` | [{command:”RENDER”, params:{props: “a”, screen: “RED_INPUT”}}] |
|`pwdFsm({"clicked submit":void 0})` | null |
|`pwdFsm({"typed":'a2'})` |  [{command:”RENDER”, params:{props: “a2”, screen: “GREEN_INPUT”}}] |
|`pwdFsm({"clicked submit":void 0})` | [{command:”RENDER”, params:{props: “a2”, screen: “SUBMITTED_PASSWORD”}}] |
{% endfullwidth %}
  
We are done!! This ends the first tutorial for learning to use Kingly state machines and the associated tooling. In the following sections, we will see more complex examples. 


