---
title: Lessons learnt 
type: tutorials
order: 39
---

**TO BE CONTINUED**

Architectural benefits:
- can use any UI
- testing was a breeze
  - FAST UI testing which is akin to integration testing
  - UI tests can be reused for integration tests
  - automatic test generation
- easy to check scenarios (resilient to design bugs)
- as long the interface between modules do not change, module can change their implementation details (extended state shape)

Cost of abstraction:
- bundle size cost 
  - computing action globally & executing action globally vs. directly performing actions locally
  - cf. difference vs. hyperapp implementation (estimated to 5-7KB / 28)
- extra interface (action + executor) means extra glue code
  - as we did to separate routes
  - or integrate Svelte
  - or integrate API gateway
- learning curve
- large machines can be hard to navigate in code
  - look up for actions, or state
  - querying for what do events trigger etc
  - the data structure answers some questions easier that others 
- refactoring state may imply updating the whole machine in the worse case (that is normal but there is no automatic refactoring tool) 

But:
- a lot of the issue can be remediated with proper tooling (which does not exist as of yet for UI. but exists for safety-critical software)
  - refactoring tool
  - typing (don't allow some properties in some state update)
  - validation (state name collision, machine contracts, etc.)
  - abstraction and machine reuse (akin to macro)
  - data structure querying (navigation, etc.)
  - sync. drawing / code
