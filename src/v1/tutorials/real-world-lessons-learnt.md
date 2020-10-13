---
title: Lessons learnt 
type: tutorials
order: 40
---

The real-world Conduit application is a reasonably large application that allowed us to use the state machine formalism on a larger scale than the previous smaller examples. The core characteristics of a state machine modelization do not change: any UI can be used; testing is a matter of encoding user scenarios into input sequences and observing the outputs produced by the state machine. As all command handlers are behind an interface, they can change their implementation details as long as they continue to abide by their interface.

There is however a cost that we pay for using the state machine abstraction. Kingly seeks to reduce that cost of abstraction, by removing one of its components --- the cost attached to the state machine library. However, the other components remain: the levels of indirection caused by the interfaces we use between machine and command handlers, and between event handlers and machine. Our unscientific estimation, after comparing with an alternative, highly similar, implementation of the Conduit app with the Hyperapp library, is that our initial, unoptimized implementation using Kingly adds around 8KB to the 28KB of the Hyperapp implementation. While it is likely possible to drive this down by reducing code duplication --- our implementation is the typical result of a TDD process before refactoring, there will always be a cost to the indirection. 

We believe that this cost is however small for the benefits that a state machine modelization brings. Additionally, using a state machine modelization also leads to bundle size savings. As a matter of fact, our unoptimized implementation still remains much smaller than any of the published alternative implementation with the major UI frameworks: 71KB for Vue, 89KB for Riot, 97KB for React + MobX, 141KB for Angular, 193 KB for Ember. Our implementation is smaller because we did not have to bring a routing or state management library --- that is handled by the state machine. We also were able to pick our UI framework to optimize for bundle size --- we picked Svelte.

There is a learning curve to getting proficient in modelizing user interfaces with state machines. That learning is however smaller than that of learning React, Vue or any full-fledged UI framework. Additionally, Kingly is designed so that it uses a minimal set of concepts for quicker onboarding (no concurrency handled in the machine, no effects performed by the machine, no entry or exit state, etc.).

In the process of implementing the Conduit application with Kingly, we surfaced a few pain points: writing a state machine by hand does not scale well; refactoring large machines can be error-prone; debugging large machines may require tracing large sequences of inputs. Most of these pain points can be remediated with appropriate tooling. That tooling exists in safety-critical industries but is not generally available to web developers. Kingly comes with its own set of tools that seeks to remediate this situation: compiler, professional graph editor, dev tool. There remains however plenty of areas to address with future tools: refactoring support, [program slicing](https://en.wikipedia.org/wiki/Program_slicing), linting, test generation, modularity, and more.

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
