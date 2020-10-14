---
title: Possible API extensions
type: api
order: 5
---

Because of the API design choices, it is possible to realize the possible extensions without modifying the state chart library (open/closed principle):

- entry and exit actions
  - decorating action factories : entry actions are already implemented and will be documented in a future version of the library. Examples can be found in the [test directory](https://github.com/brucou/kingly/blob/master/test/entry-actions.specs.js).
- contract checking (preconditions, postconditions and probably invariants - to be investigated) for both states and transitions
  - can be done by inserting in first position extra guards which either fail or throw, and decorating existing guards
- overriding initial control state and extended state
  - can be achieved by modifying the `INIT` transition (by contract there is exactly one such transition) and the `initial_extended_state`; and leaving everything else intact

Note that some extensions may perform effects (logs, ...), meaning that the order of evaluation and application of operations would then become significant in general. Extension performing effects should only be used in development.

Equipped with a history of inputs and the corresponding history of outputs, it is also possible to do property-based testing (for instance checking that a pattern in a sequence of outputs occurs only when another pattern occurs in the matching sequence of inputs).

Some extensions may be useful to check/test the **design** of the automaton, i.e. checking that the automaton which acts as the modelization of requirements indeed satisfies the requirements. When sufficient confidence is acquired, those extensions can be safely removed or deactivated.
 
