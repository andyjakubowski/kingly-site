**TODO**
- in the docs, montrer step by step the evolution of the graph (no code)
  - so maybe have bullet list of requirements and hten go one by one
  - that would be the closest to tutorial you can find!
- zoom image:
  - https://francoischalifour.com/medium-image-zoom/
  - https://github.com/francoischalifour/medium-zoom#usage
- DOC SITE: API no longer accurate!!
- BUG: contract: cannot hvae transition INIT-> History, that would infinite loop (history when none goes to INIT) 
- altogether now section with implementation
- tutorial on routing (in best practices), with implementation
- ~~article on: how state machines support micro-front end architectures~~
- article on real world with testing
  - need to clone fsm to speed up test generation
  - update the test generator
  - add some more filters to generate paths with a given prefix
  - generate multiple sequences with different data (testing also data not only control)
- debugger: best to grow the community <- attract low-level programmers <- maybe later?
- compiler <- favor actual usage in actual projects
- real world app (routing, graphql or sth like that)
- csp-inspired framework a-la-cycle makeProcess(fsm, thread, connector...) <- like, last, seems like it is a whole project, with separate testing, design and so on to think about, don't start this like that!!
  - cf. https://github.com/elastic/search-ui/blob/master/ADVANCED.md#performance
- DOCS: make drawing in introductory section:
  - cf. https://keechma.com/guides/introduction/
! run the machine in a worker with comlink and functional interface and encapsulated state it should be easy
  - could be a nice difference vs. xstate (no need to copy state every time)
  - do it for the chess game, latest version
- blog : avantage machine over hyperapp: errror flow
  - hyperapp: loading.... error in console (no fetch promise etc)
  - original demo app: loading... and nothing else
- do logging like hyperapp!
````
export default function(prevState, action, nextState) {
  console.group("%c action", "color: gray; font-weight: lighter;", action.name)
  console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState)
  console.log("%c data", "color: #03A9F4; font-weight: bold;", action.data)
  console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState)
  console.groupEnd()
}
``

# Demos
- mention the fact that the machine is ocmpiled for the svelte suspense example
- ecommerce app works iwh mobile too!
  - https://github.com/inspmoore/papu
  - https://papuyumyum.herokuapp.com/
- wizard form: move itfrontend stuff with machine
- check https://brucou.github.io/documentation/v1/contributed/index.html dead??
- rewrite all react demo to remove react-state-driven COMMAND_RENDER from react-state-driven
  - issues with code playgrounds!! leave it for now 
  
# Testing
add a WIP tag like new. and add the structure of testing not the content
decide whether to keep or remove for release!

# http://localhost:4000/documentation/v1/tutorials/password-meter-ui-implementation.html
react implementation to do -- or remove the section!

# best practices section
**TODO** best practices section
Summarize all the techniques in :
- default handler
- inject manually the event emitter
- use settings for injection if not possible

# mobile
maybe an example?

# Integration sections
try to show also integration with Android/Kotlin, maybe find a library that supports a React model 
- https://componentkit.org/ for iOS from fb
- Jetpack Compose from google (super alpha)
- Anko: https://github.com/Kotlin/anko
- framer

# Contributed
visualizer: that will be BPMN.io revamped - forked and rename, don't use as is. Remove unnecessary elements (choice junctions for instance? leave? probably don't have a choice becuase no other way to have several links right?). Keep it secret
look at framer for inspiration: https://www.framer.com/prototyping/

- add the articles
  - infoq article and dailyjs one
  - other interesting articles?

# Testing
publish article first!! in hacker-noon -> before end on june! don't forget David in Prague for testing try to use forgot the name.js for property tasting - lots of generators but give examples already with me writing my own generators?? yes 

# example section
finish here. The form multi step in example section. LATER. write something about property based testing and tet generation. At least one example then wrap up. Hopefully ready for the 30th?

# Site
- load transducer.js instead of vue.js for the demo
- load also any other libraries I will use
  - so maybe vue
  - cannot load svelte... it is a compiler...
  - react?
  - lithtml?
- customize css
  - remove all unused styl, like sponsors!

# Vision
- tool for developers like yed
  - you need to quickly change a layout, not so useful to draw it oneself
  - but still keep bpmn.io, maybe write a converter yed graphml to bpmn/io that would be best
- tool for designers to navigat the transiions of the machine, but no program, button for each transition, and each button should update state of the navigaion which basically is which transitions are enabled and disabled by the taken transition
  - should be reusing all existing designer tool - dont wrte a new thing! plugin!
- tracer/debugger
  - full vision
  - local vision of only meighbours
- DSL ./ macro/ compiler

