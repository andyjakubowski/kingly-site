---
title: Injecting dependencies
type: cookbook
order: 1
---

## Motivation
For testability reasons, we recommend that all functions used in a Kingly machine be pure. That means in particular that closures are not recommended. If you need to use a variable or function which is external to the machine, you need to make it available in the scope of a Kingly machine definition (guards, action factories, etc.).

## Recipe
Kingly exposes a `settings` parameter for the `createStateMachine` machine factory. This parameter is multi-purpose and can be used to:
- customize extra behaviour: a `debug` property for instance parameterizes the tracing behaviour of the machine
- inject dependencies used in functions defining the machine behaviour (such as guards). For instance, in the chess tutorial, we inject the chess engine. At testing time, it would be easy to test the guards simply by stubbing the chess engine
- inject variables which are out of scope of machine functions but still necessary. For instance, in the first iteration of the chess tutorial, we inject the machine event emitter.

## Sample code
```js
import Chess from  "chess.js";

import gameFsmDef from "./fsm";
import "./index.css";

const eventEmitter = getEventEmitterAdapter(emitonoff);
const chessEngine = new Chess();
const gameFsm = createStateMachine(gameFsmDef, {
  debug: { console, checkContracts: null },
  // Injecting necessary dependencies
  eventEmitter,
  chessEngine
});

```
