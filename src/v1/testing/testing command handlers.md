---
title: Testing command handlers
type: old
order: 3
---

{% tufte %}
![kingly-favoured ui architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly%20selected%20command%20handler.png)
{% endtufte %}

In our architecture, the Command Handler module is in charge of receiving commands from the Kingly machine and executing them, possibly realizing effects on the interfaced systems, and communicating back to the machine through an event emitter.  Testing the command handler module means generating command sequences and ensuring that the right effects are performed on the interface systems, and the right events are propagated to the Kingly machine. 

Let's illustrate the process with our simple Vanilla-js counter application. For that application, the command handler was integrated as follows:

```js command handler
document.getElementById("app").addEventListener("click", function() {
  const commands = fsm({ clicked: void 0 });
  commands.forEach(({ command, params }) => {
    spanEl.innerHTML = `${params}`;
  });
});
```

We have only one render command to handle. That command calls on a DOM API to render an HTML string. Testing the command handler means testing that for each input event, the command is correctly executed. Because the command is executed via API call (here `innerHTML`) on the interfaced screen system, we have to check at this level that the right parameters are passed in the API call, i.e. the right HTML is passed to the DOM for rendering.

