---
title:  Dev tool
type: tooling
order: 30
is_new: true
---

## Install
To install the extension, go to the Google Chrome Store, and search for *Courtesan* (or go [here](https://chrome.google.com/webstore/search/courtesan)), then click on *Add to Chrome*. The extension should work on all Chromium browsers. Tests are performed with the [Brave browser](https://brave.com/) rather than Chrome.

## Screenshot

{% fig %}
![](../../images/extension/courtesan%200.png)
{% endfig %}

## How to use 
Kingly developers must first download the [courtesan extension](https://chrome.google.com/webstore/search/courtesan) of the Chrome store. Then, for Kingly to send messages to the dev tool, you will need to create a Kingly state machine as follows:

```js
import {tracer} from "courtesan";
      ...
const fsm = createStateMachine(fsmDef, {debug:{console}, devTool:{tracer}});
```

The extension graphical interface is divided into two panels: the left panel which displays the messages received by the extension; and the right panel which displays specific details about the received messages.

### Left panel
The Kingly library logs:
- the input sent by the user to the machine
- the inputs processed by the machine, as a result of the machine computation
  - that includes automatic events, triggered by eventless transitions or transitions to compound states
- intermediate steps of the machine computation of outputs
  - when the machine leaves a state
- the computed outputs

### Right panel
The right panel consists of two tabs: the *Machine state* tab, and the *Details* tab.

The *Machine state* tab displays the state of the machine. As that state changes, the tab will also display a diff. between the machine previous state and the new state. The state of a Kingly machine is understood as an object with three properties:
- `cs`: the control state the machine is in. Note that if that control state is generated by the `yed2kingly` converter, control state names will start first with a `yed` identifier, followed by a reserved Unicode character and then the label for the control state entered by the user  
- `es`: the extended state for the machine
- `hs`: the history state for the machine

The *Details tab* will display data that is relevant to the message being clicked on by the extension user.

For instance, in case of:
- errors: will display information about the error
- input passed to the machine: will display the event label and event data corresponding to the input
- outputs computed by the machine: will display the outputs
 