---
title: Testing interfaced systems
type: old
order: 4
---

{% tufte %}
![kingly-favoured ui architecture](../../../../src/graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly%20selected%20interfaced%20systems.png)
{% endtufte %}

Testing the interfaced systems involves checking that on receiving API calls from the command handlers, the interfaced systems do perform correctly the expected effects, including the possible emission of API responses.

Commonly the devices which we use are both input and output devices. For a laptop for instance, the screen would be an output device, programmable through the DOM interface, while the keyboard would be an input device, whose events can be subscribed through the DOM events interface. Displaying content on a screen is thus an API call to the DOM, and subscribing to receive events from the keyboard is also an API call to the DOM. This is to say that rendering is concretely an effect just like any other, even though it occupies logically a central space in a user interface implementation. For that reason, we did not in our architecture diagram give a special position to the DOM.

Typically, the Kingly machine will issue a render command with some parameters. The command handler module will translate that into DOM API calls. We then need to check that the result of those API calls is the one expected. That generally means testing the [*look and feel*](https://en.wikipedia.org/wiki/Look_and_feel) of the application under development.
  
Testing visual appearance (a.k.a **visual testing**) is not so simple, even more so in an automated way -- though there exists some tools to that effect. We will not concern ourselves in these testing tutorials with that problem as it is not related to state machines. Often times, developers resort to testing structure rather than appearance (i.e. pixels), as it is easier to automate and faster to implement. However this must be done carefully. The user interface look and feel is the part that sees the most changes in the course of a project. It is thus important to focus on testing the specifications, without mixing in too many implementation details, lest we have to rewrite a lot of our tests every time the interface changes. Personally I think it is a good habit to annotate the produced HTML with dedicated test selectors on elements which are relevant to our specifications. A common convention using a prefixed class like `qa-...` or `data-testid` or `data-test-id`. Additionally, [`dom-testing-library`](https://github.com/testing-library/dom-testing-library) encapsulates a lot of good practices on the subject. Have a look! 

Alright, let's illustrate all the 
