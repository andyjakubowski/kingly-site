---
title: makeWebComponentFromFsm
type: api
order: 3
---

`makeWebComponentFromFsm :: ComponentDef -> FSM`

## Description
This factory function creates a web component that takes no observed attributes or properties. The behavior or logic of the component is parameterized by the machine passed as parameter. The communication capability of the component is parameterized by subjects generated from a subject factory passed as parameter. The command handling capability is provided by command handlers  and effect handlers passed as parameters. An initial event, terminal event (unused for now), and a moniker indicating the absence of actions to perform can be passed as options. 

The web component receives an input through its input subject, passes it to the encapsulated machine which computes the corresponding outputs. The web component subsequently processes those outputs via the command handlers. The web component may or may not use the output subject to emit events. At the moment, we do not have any example or test covering this use case.

Components whose behavior is defined by a machine can be seamlessly integrated into any framework by converting them to web component. Note however that the portion of the web component specification used --- [custom elements v1](https://developers.google.com/web/fundamentals/web-components/customelements), is only supported in modern browsers. In the web component scenario, communication between the web component and a UI framework's component occurs through the input and output subject or DOM events. It is not possible to use any facility provided by the framework. 

## Contract
- Type contracts
- the web component name must fulfill the web component's specifications i.e. include a hyphen in its name

## Implementation example
We have implemented a [movie search app](https://github.com/brucou/movie-search-app-nerv) with [Nerv](https://github.com/NervJS/nerv), a lightweight React clone which works with browsers down to IE8. The entry file can be found [here](https://github.com/brucou/movie-search-app-nerv/blob/master/src/index.js).

```javascript
const fsm = createStateMachine(movieSearchFsmDef, {
  updateState: applyJSONpatch,
  debug: { console }
});

function subjectFromEventEmitterFactory() {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const _ = DUMMY_NAME_SPACE;
  const subscribers = [];

  return {
    next: x => eventEmitter.emit(_, x),
    complete: () => subscribers.forEach(f => eventEmitter.off(_, f)),
    subscribe: f => (subscribers.push(f), eventEmitter.on(_, f))
  };
}

const nervRenderCommandHandler = {
  [COMMAND_RENDER]: (next, params, effectHandlers, el) => {
    const { screen, query, results, title, details, cast } = params;
    const props = params;
    render(screens(next)[screen](props), el);
  }
};
const commandHandlersWithRender = Object.assign(
  {},
  commandHandlers,
  nervRenderCommandHandler
);

const options = { initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } };

makeWebComponentFromFsm({
  name: "movie-search",
  eventSubjectFactory: subjectFromEventEmitterFactory,
  fsm,
  commandHandlers: commandHandlersWithRender,
  effectHandlers,
  options
});

render(h("movie-search"), document.getElementById("root"));
```
