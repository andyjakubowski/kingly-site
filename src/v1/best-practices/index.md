---
title: Introduction
type: best-practices
order: 1
---

This section gathers the best-practices which percolated after using state machines extensively in actual cases. A particular emphasis will be given to modelling techniques and testing. 


![](../../images/coming-soon/under-construction-png-images-label-free-download-660778.png)

# Modeling
// TODO: best practice. 
// Factorize thr latest possible. pagination is good example
// and then only factorize when great certainty that requirements will not change
// as is the case when it is intrinsic property of the specs

// When having events on compound states, think about preconditions which must be fulfilled and set a guard on it
// for isntance, in conduit home route, like an article is on home route.
// without a guard theoretically, it is possible to like an article before the articles are fetched
// in fact it is not possible because the UI does not allow it (nothing is displayed).
// It is thus good to add a guard that checks that there are articles to be liked in the first place!
// this is good for robustness (and also for test generation as confusing tests which cannot actually 
// happen in reality won't be generated) 

# Testing
// TODO: best practice. test slowly but surely. Small and minimal scenario first which test specific use cases. 
// Leave the long and imbricated scenario for the generative testing.
// Have UI with props
// Test the machine outputs by postprocessing the render commands to get the UI props
// Write expected outputs as UI props, so the tests are not linked to the machine anymore but to the specs
// That means simulate the render effect handler in the test!!
// Ex: Conduit Svelte

# IMplementimg
// If merging props, the first render command on the graph should pass all props 
// If showing component before machine started, have no initial value for props but handle instead undefined values smoothly
// when implementation machines, go in order of graph (i.. scenarios order), instead of first guards, then transitions etc.

lots of issues with arrays of arrays... specially when making tests that slows down a bit. Maybe use jsdoc or typescript!

// Issues with controlled components: if using additive props, pass the controlled props as in React
// Issues with stale props: pick up a source of truth (value returned from the database stored in state) rather than prop.
// - this happened to me because ?? I am not sure really, but the props passed was stale. Probably because we did a deep update in an object,
//   that object is scattered through components, and probably one reference was the same and did not trigger redraw.
//   so to avoid dependency between view and machine, just use always the source of truth not linked to the view if I have one
