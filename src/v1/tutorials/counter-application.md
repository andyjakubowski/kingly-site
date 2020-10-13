---
title: Counter application
type: tutorials
order: 1
---

We continue here with a very trivial example often used as a starter by user interfaces libraries: a counter application. As with any trivial example, it does not properly illustrate the power of the library. We will be short on explanations. The example however is useful to give a feel of the API. 

The counter behavior is described by the following state machine:

![counter machine](../../graphs/trivial counter machine.png)

The machine starts in the counting control state, with an extended state which holds the initial value of the counter: `{count: 0}`. Every time a click occurs, the transition visualized on the previous graph tells us what commands to execute: increment the extended state's `count` property, and display the incremented counter on the screen.

The machine computes the commands to execute. We only have to write the procedures which execute those commands to have the full counter application: 

<iframe src="https://codesandbox.io/embed/w6x42521n7?fontsize=12&hidenavigation=1" title="Counter app" style="width:1000px; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

We can already emphasize a key feature of Kingly's state machines. **They are normal, plain, standard JavaScript functions!** In this trivial example, that means you can replace the `fsm` created by Kingly in the previous code by your own function `controller` fulfilling the same specifications:

```js
let counter=0;

function controller(event){
  const eventName = Object.keys(event)[0];
  if (eventName === 'clicked'){
    counter++;
    return {command: COMMAND_RENDER, params: counter}
  }
  
  return NO_OUTPUT
}
```

This is it! There is nothing weird. We write stateful functions like `controller` all the time when implementing user interfaces. Using an explicit state machine to write those functions and drive our user interface brings a lot of benefits that will be introduced in the remainder of the tutorials. 

This is the very short story about state machines used for modelling interface's behavior. The machine works as a controller that transforms inputs/events into commands. The application is implemented by sequential composition of three parts: listening to the inputs, computing the corresponding commands, and executing those commands. To execute the render command, you can use any UI library you fancy, or just plain JavaScript.
