---
title: Implementation
type: tutorials
order: 3
---

{% ptip %}
This section deals with a very trivial example often used as a starter by user interface libraries: a counter application. As with any such example, it does not properly illustrate the power of the library. This tutorial gives a first feel of the Kingly API. It also shows that Kingly state machines are simple stateful JavaScript functions, like the event handlers that you have been writing. Lastly, it introduces slightly the architecture that Kingly encourages.
{% endptip %}

Let's implement the simplest behavior we can think of: a counter. A behavior is the set of reactions that corresponds to the set of accepted events. Here, there is only one event: the user click on the incrementing button. The behavior of the counter application is to display an incremented counter every time the user clicks the incrementing button. This behavior can be represented with a state machine that:
- starts  in the *Counting* state (termed as *control state*);
- encapsulates the counter value in its internal state (termed as *extended state*); and
- on every click, updates its internal state (increments the counter), and displays the new screen.

In other words, the counter behavior may be described as follows:

![counter machine](../../graphs/trivial counter machine.png)

The previous graph illustrates the `event [guard] / actions` notation that is used by the graph editor and throughout all the tutorials. Here there are no guards, as the action must always be computed when the event occurs. 

The machine only computes the commands to execute and updates its internal state. We have left to write the procedures that execute those commands to have the full counter application: 

<iframe src="https://codesandbox.io/embed/w6x42521n7?fontsize=12&hidenavigation=1" title="Counter app" style="width:1000px; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Open the console in the playground and have a look at the logs. Click the button, and have another look at the logs. Formatting aside, you should see this:

```bash
send event ▶{init: Object}

found event handler!
WHEN EVENT init ▶{count: 0}
IN STATE nok
CASE: unguarded transition
THEN : we execute the action ACTION_IDENTITY
left state -nok-
AND TRANSITION TO STATE -counting-
ENTERING NEXT STATE: -counting-
with extended state: ▶{count: 0}

send event ▶{clicked: undefined}

found event handler!
WHEN EVENT clicked undefined
IN STATE counting
CASE: unguarded transition
THEN : we execute the action incCounterAndDisplay
left state -counting-
AND TRANSITION TO STATE -counting-
ENTERING NEXT STATE: -counting-
with extended state: ▶{count: 1}

OUTPUTS: ▶(1) [Object]
        ▶0: Object
            command: "render"
            params: 1
```

The logs allows you to trace back the machine processing as it receives an input. You can activate the logs by passing a console object in settings (`const settings = { debug: { console }};`).

The previous code illustrates a key feature of Kingly's state machines. **They are normal, plain, standard JavaScript functions!**. That means you can replace the `fsm` created by Kingly in the previous code by a function `controller` fulfilling the same specifications:

```js
let count=0;

function controller(event){
  const eventName = Object.keys(event)[0];
  if (eventName === 'clicked'){
    count++;
    return {command: "render", params: count}
  }
  
  return void 0
}
```

This is it! There is nothing weird. We write stateful functions like `controller` all the time when implementing event handlers. Behind the fancy name of state machines is simply a function that computes commands from events. We already write those functions. Writing them by adopting the discipline of the state machine formalism brings a lot of benefits that will be introduced in the remainder of the tutorials. 

This is the very short story about state machines used for modeling the behavior of user interfaces. The machine works as a controller that transforms inputs/events into commands. The application is implemented by sequential composition of three parts: instantiation of event listeners, computation of the reaction (commands) to events, and execution of the reactions. To execute the command that render a screen, you can use any UI library you fancy, or just plain JavaScript -- as we did in this example.

Let's move to a more interesting example: [a password meter](./password-meter.html).
