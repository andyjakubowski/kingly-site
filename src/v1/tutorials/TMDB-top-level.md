---
title: Top level breakdown
type: tutorials
order: 16
---

The key to reaching a modelization of a behaviour with state machines is to remember that said behaviour is the relation between incoming events and the commands to perform on the interfaced systems. Equivalently, it is a pure function between a sequence of incoming events and the corresponding sequence of commands to perform on the interfaced systems. You are going to read that as many times as necessary all over the tutorials because it is just that important.

Let's consider our TMDB online interface with this in mind. In the relation, we have first the events, and then the actions. Those two we know. Then we have to express the functional mapping between the two. 

Let's start with events. What events do we have incoming to our interface? 

|Event|Description|
|:---|:---|
|`ROUTE_CHANGED`|the first event to consider is the one that leads to the user to the online interface in the first place. In our case, that is a routing event: the url changes to whatever route that means the online interface should be operative.|
|`SEARCH_RESULTS_RECEIVED`|The TMDB database querying may succeed|
|`SEARCH_ERROR_RECEIVED`|The TMDB database querying may fail|
|`QUERY_CHANGED`|The user may change the movie to query TMDB against by updating the input field|
|`MOVIE_SELECTED`|The user may select a displayed movie|
|`MOVIE_DETAILS_DESELECTED`|The user may click to remove the view of the selected movie's details|
|`SEARCH_RESULTS_MOVIE_RECEIVED`|The TMDB database movie detail querying may succeed|
|`SEARCH_ERROR_MOVIE_RECEIVED`|The TMDB database movie detail querying may fail|

What actions do we have?

|Event|Description|
|:---|:---|
|`COMMAND_RENDER`|We have to display screens|
|`COMMAND_MOVIE_SEARCH`|We need to query the TMDB database for movies|
|`COMMAND_MOVIE_DETAILS_SEARCH`|We need to query the TMDB database for movie details|

Now let's see how we can express the relationship between events and commands. Remember that we want to arrive to a procedure `fsm` such that `commands = fsm(event)`, with `fsm` having encapsulated state. 

To start with, our specifications dictate that routing to the appropriate url should trigger the display of the user interface. In the absence of that event, it does not matter which other events are sent to the machine, there will be no commands to execute (indicated in Kingly by `NO_OUTPUT`). In other words, using pseudo code, `fsm` is such that:

```haskell
fsm :: Event -> Commands
| if there was a past routing event with the TMDB slug     (<- state reflecting past events)
|    fsmA
| else 
|    fsmB

fsmB :: Event -> Commands
| if event is routing event and has TMDB slug then
|   there was a past routing event with the TMDB slug <- true
|   fsmA
| else 
|   event => NO_OUTPUT

fsmA :: Event -> Commands
| (how to precisely deal with the rest of events we'll figure out later) 
```

Looking at the `fsm` pseudo code, we associate `fsm` to two entirely different computations depending on a condition. In short, the condition affects the **control flow** of the computation of commands. The piece of state which we have identified, we appropriately called it a **control state**. So we have two control states now. The one the machine starts in (call that `init` for now), and then the one corresponding to *there was a routing event in the past with the TMDB slug* (call that `TMDB app`).

With this, we can write the equivalent JavaScript code as follows:

```javascript
// Starting with there was a past routing event with the TMDB slug <- false
let controlState = INIT;  

function fsm(event){
  if (controlState !== INIT) {
    return fsmA(event)
  }
  else {
    return fsmB(event)
  }
}

function fsmB(event) {
  if (isRoutingEvent(event) && isTMDBSlub(event)) {
    controlState = TMDB_APP;

    return fsmA(event)
  }
  else {
    return NO_OUTPUT
  }
}

function fsmA(event) {
  // Don't know yet exactly how to write it
  // but we know the mapping, that's our specs
  ...
  return...    
}
```

The equivalent state machine modelization, adding to the picture all the events handled by the machine, and the corresponding actions, is as follows:

![top level state machine](../../graphs/movie-search/TMDB%20start.png)

You will recognize `fsmB` as ruling over the computation of commands in the control state *init*, and `fsmA` as the ruler when the machine is in the control state *TMDB app*. As a reminder of our visual formalism, the following arrow of the state machine graph:

```text
QUERY_CHANGED [shouldProcess]
/ ??
```

expresses the fact that, in some conditions (determined by the `shouldProcess` predicate), when the value of the input field changes, e.g. when the user types in, the application must execute some commands, which we have not determined yet, hence the interrogation marks `??`. The guard `shouldProcess` prevents a `QUERY_CHANGED` event from being processed when it should not. That is the case for instance when the interface displays a movie detail view in which the content of the query input field **cannot** be changed because it is not accessible. In other words, the guard protects us against processing semantically invalid or unexpected events. This helps **robustness**, which is defined as the ability of a computer system to cope with errors during execution and cope with **erroneous inputs**. 

Note that we have completely explicited `fsmB` but only partially explicited `fsmA`. We have not explicited at all the `shouldProcess` functions, and the commands to compute as a result of events processed by `fsmA`.
 
However, we obtained a partial implementation which already fulfills a small part of our specification:
- running `fsm` with a routing event whose embedded url is not a TMDB url should result in `NO_OUTPUT`

If you look at `fsmA`, you will observe that it has the same shape as `fsm`: it is a function which takes events and returns commands. This means we can apply the same process we did for `fsm` to fulfill a larger part of our specifications, till we eventually fulfill the whole specification set. This is the essence of the top-down method. We break down a computation into computations with a smaller scope, and then we go figure out how to implement the smaller computations. The process by which we progressively detail the implementation of a `fsmX` function is called **refinement**. 

With that established, let's refine.
