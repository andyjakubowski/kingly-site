---
title: Online interface to TMDB movie database
type: examples
is_new: true
order: 5
---

## Motivation
This example is a non-trivial user interface, dealing with error flows, asynchronous requests and the associated concurrency issues. This example is extensively discussed in a [dedicated article](https://www.infoq.com/articles/robust-user-interfaces-with-state-machines/) on state machines.

## Modelization
![Online interface to TMDB movie database machine graph](https://res.infoq.com/articles/robust-user-interfaces-with-state-machines/en/resources/18-movie-search-good-fsm-corrected-flowchart%20no%20emphasis%20switchMap-1555879148127.jpg)

## Implementation
<iframe src="https://codesandbox.io/embed/ym8vpqm7m9?fontsize=12&hidenavigation=1" title="Counter app" style="width:1000px; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
