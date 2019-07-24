---
title: Routing
type: tutorials
order: 17
---

In the next step, we observe that we are doing different things (e.g. different computations) according to the route event we received. Per our specifications, abstracting the `TMDB_APP_SLUG`, we have:

| Route | Shows |
|:---|:---|
|`/`|Screen with most popular movies| 
|`/:query`|Screen with movies related to `query`| 
|`/:query:/:id`|Screen with detail of the movie identified by `id`| 

This, in addition to the requirements about loading screens, gives us a more explicit `fsmA`:

{% tufte %} 
Yes, we could implement `fsmA` without using the *ROUTING* control state. We do need the eventless *ROUTING* state though to express `fsmA` semantics in the equivalent state machine, so we keep it here to allow for direct comparison.
{% endtufte %}

```javascript
function fsmA(event){
  if (controlState === TMDB_APP) {
    controlState = ROUTING;
    return fsmA(event)
  }
  else if (controlState === ROUTING){
    // remember that by construction the received event is a routing event
    const route = getRouteFromRoutingEvent(event);
    const {query, id} = match(route);
    if (matches(route, '/') {
      controlState = MOVIE_DEFAULT_QUERY
      return [displayLoadingScreen(''), queryPopularTMDB()]
    }
    else if (matches(route, '/:query') {
      controlState = MOVIE_CUSTOM_QUERY
      return [displayLoadingScreen(query), queryTMDB(query)]
    }
    else if (matches(route, '/:query/:id') {
      controlState = MOVIE_DETAIL
      return [
        displayLoadingScreen(query, id),
        queryTMDB(query),
        queryDetailTMDB(id)
      ]
    }
    else {
      // Unexpected or invalid route
      return NO_OUTPUT
    }
  }
  else if (controlState === MOVIE_DEFAULT_QUERY){
    return fsmC(event)
  }
  else if (controlState === MOVIE_CUSTOM_QUERY){
    return fsmD(event)
  }
  else if (controlState === MOVIE_DETAIL){
    return fsmE(event)
  }
  else {
    // not possible
  }
}
```

Note that we now have `fsmC`, `fsmD` and `fsmE` appearing to deal with particular states of the `fsmA` computation, and that we left that undefined for now. As before, we do not know yet the explicit form they take, though we do know which events they handle and the commands resulting from processing those events.

This can be summarized by the following state machine which has similar semantics:

{% tufte %} 
For readability purposes, going further, we are not going to represent control state's self-loops which we cannot fully express yet (`shouldProcess` not explicited yet). For instance, the flow related to the processing of the `SEARCH_RESULTS_RECEIVED` event in the *Movie Custom Query* control state will not be represented.
{% endtufte %}

![TMDB with routing](../../graphs/movie-search/TMDB%20routing.png)

You should be able to see confirmed a pattern now in our implementation. According to our control state, we delegate the processing of events to dedicated functions `fsmX`. This is generally referred to as [the state pattern](https://en.wikipedia.org/wiki/State_pattern).

One more thing. Have a look at the computed commands for the `MOVIE_DEFAULT_QUERY` and `MOVIE_CUSTOM_QUERY` control states. We can factor the two computations into one by adding an extra parameter. First, we refactor `queryPopularTMDB` and `queryTMDB` into `queryMovies`:

```javascript
function fsmA(event){
  if (controlState === TMDB_APP) {
    controlState = ROUTING;
    return fsmA(event)
  }
  else if (controlState === ROUTING){
    // remember that by construction the received event is a routing event
    const route = getRouteFromRoutingEvent(event);
    const {query, id} = match(route);
    if (matches(route, '/') {
      controlState = MOVIE_DEFAULT_QUERY
      return [displayLoadingScreen(query || ''), queryMovies(query || '')]
    }
    else if (matches(route, '/:query') {
      controlState = MOVIE_CUSTOM_QUERY
      return [displayLoadingScreen(query || ''), queryMovies(query || '')]
    }
    (...) // no changes
}
```

Then we collapse the two aforementioned control states into a new one `MOVIE_QUERY` (and add an `extendedState` variable to the `controlState` variable in closure of the top level `fsm` -- not visible here):

{% tufte %} 
Yes, we could refactor further and join together the `matches(route...)` branches and conserve semantics. We won't. It is beneficial when we read a machine to be able to match it quickly to the specifications. Because our specifications mention three routes with differentiated behaviour, we keep those three routes visible in three separate branches. 
{% endtufte %}

```javascript
function fsmA(event){
  if (controlState === TMDB_APP) {
    controlState = ROUTING;
    return fsmA(event)
  }
  else if (controlState === ROUTING){
    // remember that by construction the received event is a routing event
    const route = getRouteFromRoutingEvent(event);
    const {query, id} = match(route);
    if (matches(route, '/') {
      controlState = MOVIE_QUERY
      extendedState = updateState(extendedState, {query: ''})
      return fsmA(event)
    }
    else if (matches(route, '/:query') {
      controlState = MOVIE_QUERY
      extendedState = updateState(extendedState, {query})
      return fsmA(event)
    }
    else if (matches(route, '/:query/:id') {
      controlState = MOVIE_DETAIL
      return [
        displayLoadingScreen(query, id),
        queryTMDB(query),
        queryDetailTMDB(id)
      ]
    }
    else {
      // Unexpected or invalid route
      return NO_OUTPUT
    }
  }
  else if (controlState === MOVIE_QUERY){
    return fsmF(event)
  }
  else if (controlState === MOVIE_DETAIL){
    return fsmE(event)
  }
  else {
    // not possible
  }
}

function fsmF(event){
  const eventName = getEventName(event)

  if (eventName === ROUTE_CHANGED){
    const {query} = extendedState;

    return [displayLoadingScreen(query), queryMovies(query)]
  }
  else if (eventName === MOVIE_SELECTED && shouldProcess(...)){
    ... some stuff we will figure out later
  }
  else {
    ... later alligator
  }
}
```

The newly introduced `extendedState` allows us to collapse several control states into one, provided that the variability in the computation performed in those control states in entirely captured by `extendedState`. In other words, instead of expressing the difference in the computations through the `controlState` variable as we first did, we parameterize that difference with the `extendedState` variable. For this to work, we need to have computations that are sufficiently similar to be equal, up to a parameter (here `query` is that parameter).

Reducing the number of control states gives us graphs which are shorter, more readable, and easier to check against specifications.

It is important also to understand the origin, and intended meaning of those two kinds of state. So let's start one more time from the basics. Our specifications lead to a **procedure** between commands to execute and an event occurring in the interface: `commands = fsm(event)`. Depending on past events, the same event newly occurring may lead to executing different commands. We define the state of `fsm` as the variable `state` that captures the variability in the computation of commands. That means exactly that `state` allows us to define a **pure function** $g$ such that $commands = g(state, event)$ and `commands = fsm(event)` are simultaneously true all the time. Reread that as many times as necessary till it sinks in. State is a thing which **gives us a pure function when we don't have one**.

Writing `f` as a Kingly state machine means that we are able to extract from `state`, a `controlState` whose value uniquely determines the computation to perform. So $commands = g'(controlState, extendedState, event)$, where for each control state, $g'$ is replaced by a $g\_{[controlState]}$ to perform the equivalent computation $g\_{[controlState]}(extendedState, event)$. This is exactly what we have strived to exemplify so far with all the `if/then/else` branching and the `fsmX`. Control states allow to pick the computation to perform, extended state parameterizes the chosen computation. This may sound very theoretical but it sinks in through abundance of examples and practice. The idea is to reach a point where you model the behaviour of your interface directly with the state machine formalism, without passing by the code. This leads to robust code because:
- it is easy to introduce mistakes in our hand-written code with the abundance of branching to handle
- it may be hard to navigate that hand-written code to track which part of our code participates in implementing a given part of our specifications 
- it is relatively easy to navigate a state machine modelization and check the described behaviour against specifications
- with experience, it is easier and faster to write the state machine corresponding to the sought behaviour vs. hand-writing it 
- as importantly, it is easier to correctly update the state machine modelization than it is to modify a code with a lot of logical branches
 
By the way, the updated machine visualization after our refactoring is as follows:

![TMDB with routing refactored](../../graphs/movie-search/TMDB%20routing%20-%20refactor.png)

Additionally we also fulfill a little bit more of our specifications. Previously, we fulfilled:
- running `fsm` with a routing event whose embedded url is not a TMDB url should result in `NO_OUTPUT`

Now, we fulfill:
- running `fsm` with a TMDB routing event of the shape `'/'` should result in displaying a loading screen, and querying the database for popular movies
- running `fsm` with a TMDB routing event of the shape `'/:query'` should result in displaying a loading screen, and querying the database for movies related to `query` 

Let's refine further.
