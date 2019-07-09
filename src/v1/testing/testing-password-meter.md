---
title: Testing the password meter
type: old
order: 6
---

## Testing the machine
The machine modelizing the password meter behaviour was:

![password submit fsm](../../../../src/graphs/password%20submit%20fsm.png)

We have three events : `TYPED_CHAR` (t), `CLICKED_SUBMIT` (c), `START` (s). We are thus going to test input sequences described by the *regex* `[stc]*`. In what follows, we will also denote a letter by `t'` and a number by `t"`. Furthermore, a machine output will be denoted by `_|C` where `_` corresponds to the absence of commands, and `C` is an array of commands. 

### Oracle
A machine output at a given time depends on the history of machine inputs. We could write an oracle for this machine, but that would essentially be formalizing the relationship between the current output and the previous inputs, and that is exactly what we already did when modelizing the machine. The problem with doing this is that, in the general case, we end up with a task of complexity similar to modelizing the machine itself. Thus, the probably of making mistakes while writing the oracle is not that much lower to that of making mistakes when writing the machine. The oracle serves to test the machine, but we have nothing to test the oracle against. Hence when we use oracles, we have to be confident that they are correct or they must come already tested.
 
There usually are specific cases (generally corresponding to key user scenarios) for which we can easily derive the oracle: 

|Test sequence *regexp*|User scenario|
|:---|:---|
|`s[t']*[t"]*c` | User submits a strong password|
|`s[t"]*[t']*c` | User submits a strong password|
|`s[t"]*c` | User try and fails to submit a weak password|
|`s[t']*c` | User try and fails to submit a weak password|

Additionally, we can also find edge cases for which computing the oracle is easy:

|Test sequence *regexp*|Pathological case|
|:---|:---|
|`ss+[t']*s+cs+` | The machine receives several unexpected `start` events |

User scenarios are important to generate confidence that the machine does what it should. Edge cases check the [robustness](https://en.wikipedia.org/wiki/Robustness_(computer_science)) of the machine i.e. its capacity to cope with unexpected or erroneous inputs.
 
### Properties
{% tufte %}
Safety properties are important to check that the machine does not do what it should not.
{% endtufte %}
 
 We have seen that we can also use properties for our testing. What properties do we have applying to our input sequences? Important properties can be found by eliciting conditions that absolutely cannot occur ([**safety properties**](https://en.wikipedia.org/wiki/Safety_property)):
 - Any password submitted by the password meter must be strong -- anything else would be a potential disaster down the road.
 - There cannot be any exception while computing machine outputs. 

{% tufte %}
The properties listed in this section do not pretend to be exhaustive. Picking which properties to test against is a skill that develops with experience. One should select those properties that are more likely to reveal bugs.
{% endtufte %}
 
Other properties correspond directly to the specifications:
- After any modification of the password input field, the visual feedback must be correct (green if and only if the password in the input field is strong). 
- The application only ever submits a password once. 
- The machine must return `_` to all `s` events past the first one (you can only start the password meter once).

In addition to that we may want to take a few random test sequences, and check the results manually.



**TODO** do some code with the generators. Also talk about how properties ideal cover a large portion of the test space. That is for the confidence part. User scenario must cover the main paths for the user.

## Testing the command handlers
with vanilla js impl. we haven't implmented th architectur separatting efects so we canno test modules separately. So we have to test integrationly or with dom-testing-library, transforming input sequenecs into DOM actions and reading DOM to observe action results.

With vue.js we implemented the architecture with vue-state-driven library, so just have to test the Vue<props> component! go over the props space, mock the next handler to check correct events are received. Show the default render handler. and say it is already tested. i.e. 

Vue component can be tested visually or structurally with snapshots. Find a snapshot library or a logger? snapshots actually test the DOM API call (render) with the generated HTML. Or with storybook? render the component isolatedly and test the event handler
or https://www.chromaticqa.com/? use the best tool!!

vanilla-js: immediate mode: imperative, and performant
react: retained mode: declarative

in tufte:
- https://engineering.ezcater.com/the-case-against-react-snapshot-testing
- https://blog.usejournal.com/whats-wrong-with-snapshot-tests-37fbe20dfe8e
- https://www.valentinog.com/blog/testing-react/
  Put it another way: consider writing a snapshot test when you’re sure the component is stabilized.
Also talk about TDD maybe in the introduction section

## Testing interfaced systems
here only the DOM. No need to test the DOM, the DOM is already tested. 

## What we learnt
Architecture is important for testing. process: generate sequences, apply oracle and properties, test all modules

But how to generate input sequences? Our simple examples, we can generate it ourselves ahead of time. In presence of concurrency we will have to use a more automatic method.

- for render, this means testing that the API call - for DOM the HTML render is conform to specification
  - but also!! that events are emitted when they should, i.e. that a click on a button leads to an event sent to the machine
- there is no other command handlers

- f([input]) = [outputs]
- input (machine) is a text box content
  - different from DOM event - talk abou the distinction
- user scenarios
  - good password
  - wrong password
- properties of machine
  - submitting
    - submit in [outputs] => only one submit
    - submit in [outputs] => first submit is submittting a strong password
    - no submit in [outputs] => no submit in input
  - feedback/meter
    - weak input => red screen props render
    - strong input => green screen props render
- properties of interface
  - submitting
    - a submitted password only if strong
    - only ever one password submitted
    - submit only through submit button
  - feedback/meter
    - weak input => red screen 
    - strong input => green screen 
  
- generate input sequence of which I know the results
  - example-based testing: generate user scenario
  - user enters weak password and see red screen
  - user enters strong password and see green screen
  - user enters strong password and click submit
  - user enters weak password and click submit
NOT BAD but there are other cases. Should test random value for the data.
  - do it with generators!

- generate input sequences of which I don't know the results
  - semi-random sequence of input and submit
  - apply properties to get a rejection
  - note the first property is that the appication does not throw! for every ui
  
Generating scenarios whose results we know gives some confidence. Beign able to parameterize them give more confidence as on can explore a larger set of the test space. Generating random input sequences is about looking for violation of properties and uncovers edge cases. That is the real value of it. Generally basic testing stragithen the easy paths. Issues is non-easy path, rare paths, or issue occurring after repetition and concurrency

https://www.logigear.com/magazine/test-automation/are-test-design-techniques-useful-or-not/


**TODO**
  beware that we do not perfectly achieve the goal of testing against spec by unit testing the machine. We could change the machine to an equivalent one - would that change the test? A priori only if the event/output sequnce change sa the test f(event sequence) = output sequence. So if we change the commands then yes, but changing the commands would not that mean changing the specs?? Well talk about it anyways
