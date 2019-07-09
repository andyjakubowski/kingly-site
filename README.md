## Install and run locally

``` bash
$ npm install
$ npm start # dev server at http://localhost:4000
```

title: Introduction

The problem of testing user interfaces is intimately linked to that of specifying user interfaces. The latter presents the following characteristics:
- User interfaces are often specified through an iterative process by which high-level requirements may change, drop or be refined into more fine grained requirements down to the exact visuals of the interface
- a user interface is often a part of a distributed system, involving a fair share of asynchronous, concurrent communications
- even when not explicitly specified, it is expected that user interfaces must react gracefully to unexpected/malformed inputs

As a result, we want a testing process which:
1. test against specifications rather than implementation details. As the interface specifications are refined, we want to minimize the impact on our tests
2. we want to test against concurrency and asynchronicity in a way that generates confidence in the behaviour of our interface under random ordering and combination of concurrent inputs
3. we want to test our user interface under hostile conditions, in which the interface receives erroneous or unexpected inputs.

{% tufte %}
![kingly-favoured ui architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly.jpg)
{% endtufte %}

On the other hand, given our [high-level modular architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly.jpg), testing our interface implementation can be reduced to **unit-testing each of our modules** (Kingly fsm, the command handler and the interfaced systems) **separately**, and then integration-testing the modules taken together.

We will leave aside the subject of integration testing for now. In the following sections, we will present the guiding principles for testing each module -- taking the trivial counter app as an introductory example. Then we will apply those principles to the testing of the example applications used in the [tutorials](../tutorials). By doing so, we will try to showcase how we handle the three aforementioned characteristics of a good user interface testing process.

## Testing the Kingly machine
Remember how in a previous section, we explained that a user interface can be specified by a relation between events received by the user interfaces and actions to be performed as a result on the interfaced system. We identified equivalent functions $f$ and $g$ such that

$$\begin{cases} actions &=& f(state, event) \\
(actions_n, state_{n+1}) &=& g (state_n, event_n) &\forall n& \end{cases} $$

We then explained that a state machine is just a breakdown of the `state` variable into a control state variable and an extended state variable. We now introduce a pure function $h$ which allows us to perform testing. That gives us three equivalent versions of the same relation:

$$\begin{cases} actions &=& f(state, event) \\
(actions_n, state_{n+1}) &=& g (state_n, event_n)  &\forall n& \\
[actions_1, ..., actions_n] &=& h([event_1, ..., event_n]) &\forall n& \end{cases}$$

Intuitively this is easy to see. If you take a user interface in its initial state, given that its internal state is only modified by itself as a result of incoming events, given that actions are only emitted as a result of incoming events, then the sequence of events entirely determines the sequence of actions. Having a pure function, we have a straightforward testing methodology. We generate input sequences for the machine, we observe the sequence of outputs of the machine and compare that with what is expected per the specifications.

Let's see this in practice with the simple counter application:

![counter machine](../../../../src/graphs/trivial%20counter%20machine.png)

The machine only accepts one event (`clicked`) and has only one state (`counting`):

```js
const fsmDef = {
  states: { counting: "" },
  events: ["clicked"],
  initialExtendedState: { count: 0 },
  initialControlState: "counting",
  transitions: [
    {
      from: "counting",
      event: "clicked",
      to: "counting",
      action: incCounterAndDisplay
    }
  ],
  updateState
};
```

Any legal sequence of events can be described by the regular expression `e+` where `e` stands for the click event `{clicked: void 0}`. Here is a portion of the $h$ functional mapping:

| Event sequence | Actions sequence |
|:---:|:---|
| e | `[ [display counter 1] ]` |
| e | `[ [display counter 1], [display counter 2] ]` |
| e | `[ [display counter 1], [display counter 2], [display counter 3] ]` |

`display counter n` here represents the render command produced by the machine. We denote that by $g(n)$:

```js
{
  command: "render",
  params: n
}
```

{% tufte %}
![kingly-favoured ui architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly%20selected%20kingly.png)
{% endtufte %}

We just described one testing strategy for the Kingly machine: produce input sequences, run them through the machine, compare the resulting output sequences to the expected output sequences. In this simple case, we have a formula for the output sequences. We call that an **oracle**, not in honour of a famous database company, but alluding to a "priest or priestess acting as a medium through whom advice or prophecy was sought from the gods in classical antiquity". An oracle is a function which applied to an input sequence gives us the expected output sequences.

Our test space for the `e+` is infinite. We need only pick a number $n$ of repetitions to describe our test sequence so the test space is equivalent to ($~[1, \infty[$), and we won't be going through an infinite test space in finite time, so we will naturally only generate a limited amount of tests. Ideally we pick those tests so that they maximize our confidence in the good behaviour of our application, or identify bugs in our implementation. One way to do this here would be to pick a random number $n$, generate the sequence and compare the results with the oracle. This technique is called **random testing** and belongs to the statistical testing techniques. Random testing may be used to eliminate the bias from the tester when manually picking input sequences from a large test space.

A broader technique is to establish properties that the output sequences must fulfill, and use that to test against the results. The oracle which tells us that $h([e, ..., e]) = [g(1), ..., g(n)]$ is itself a property. Another property could be that whatever the length $n$ of the input sequence made of repeated `e`, the last output of the output sequence is $g(n)$: $\forall n, h([e, \ldots, e])  = [..., g(n)]$.

That technique is called **property-based testing**, and is pretty useful when there is no oracle available for verifying the output sequences. Incidentally, there is a core property that all Kingly machines must have: they must compute something! That means that they cannot throw an exception. When there is nothing else we can say about a machine, we can always at least check that it does not throw exceptions under any input sequences.

Alright, this was a little bit of a trivial example. We will take it up a notch when we will test the password meter and the chess games from the tutorials. However, we will apply the same techniques, so it is good if you get familiar with them with a simple example.

## Testing the command handler module
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

## Testing the interfaced systems
{% tufte %}
![kingly-favoured ui architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly%20selected%20interfaced%20systems.png)
{% endtufte %}

Testing the interfaced systems involves checking that on receiving API calls from the command handlers, the interfaced systems do perform correctly the expected effects, including the possible emission of API responses.

Commonly the devices which we use are both input and output devices. For a laptop for instance, the screen would be an output device, programmable through the DOM interface, while the keyboard would be an input device, whose events can be subscribed through the DOM events interface. Displaying content on a screen is thus an API call to the DOM, and subscribing to receive events from the keyboard is also an API call to the DOM. This is to say that rendering is concretely an effect just like any other, even though it occupies logically a central space in a user interface implementation. For that reason, we did not in our architecture diagram give a special position to the DOM.

Typically, the Kingly machine will issue a render command with some parameters. The command handler module will translate that into DOM API calls. We then need to check that the result of those API calls is the one expected. That generally means testing the [*look and feel*](https://en.wikipedia.org/wiki/Look_and_feel) of the application under development.

Testing visual appearance (a.k.a **visual testing**) is not so simple, even more so in an automated way -- though there exists some tools to that effect. We will not concern ourselves in these testing tutorials with that problem as it is not related to state machines. Often times, developers resort to testing structure rather than appearance (i.e. pixels), as it is easier to automate and faster to implement. However this must be done carefully. The user interface look and feel is the part that sees the most changes in the course of a project. It is thus important to focus on testing the specifications, without mixing in too many implementation details, lest we have to rewrite a lot of our tests every time the interface changes. Personally I think it is a good habit to annotate the produced HTML with dedicated test selectors on elements which are relevant to our specifications. A common convention using a prefixed class like `qa-...` or `data-testid` or `data-test-id`. Additionally, [`dom-testing-library`](https://github.com/testing-library/dom-testing-library) encapsulates a lot of good practices on the subject. Have a look!

## What we learnt
We can test the user interface implementation, by testing first separately the three modules of our architecture and then testing the module together.

Testing the machine requires invariably generating test sequences, and gathering the outputs produced by the machine in response to the test sequences. Three overlapping cases may appear:
1. we have an oracle by which we compute separately the expected outputs of the machine, and compare with the produced outputs
2. we know properties that the expected outputs must have, and we check that the produced outputs have those properties
3. we have to check manually whether the produced outputs abide by the interface specifications

Testing command handlers involves checking that the received commands are corrected translated into the right sequence of API calls.

Testing the interfaced systems means ensuring that the effects realized by the interfaced systems are the one expected. An omnipresent interface in a web application is the DOM. We have to be careful to test against the DOM in a way that resists well to the inevitable changes in the specifications.
