- add counter with Ink in react terminal in the docs!!
Excellent doc structure:
- https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain
- overview
- quick starts
- concepts
- how to guide
- tutorials
- resources
- Q&A (on top)
- code samples (on top)
- also feedback section in all pages
  - and the view all pages feddback
  - and the was that information useful yes/no
- filter **by title** button (I can do that client-side!!)
- also a share this document button would be good to attract people... Add nice articles people want to read and share 
**TODO**
** ADD ADDRESS FOR DEMO: https://rw-kingly-svelte.bricoi1.now.sh/**
**medium-like image: https://blog.bitsrc.io/react-at-60fps-building-a-medium-inspired-zoom-with-react-pose-667499a3922**
**TODO: review, I actually have to modelize first before writing the tests. Taht is still TDD because I don't write the implementation before the tests. And then add that we chose tests that guarantee transition coverage. So new order would be to write the view first, that gives the user events and the render command interface. Then test UI. Then identify the commands on the intrefaced systeems. The implement the commands. That gives the interfaced system events (generally coming as a result for interfaced system commands). Then write the modelization (we have events, and commands shape by now). Then write the tests for transition coverage. Then implement. Change the documentation?? ONLY AT THE END. Just change it for the user profile for now.**

** View input/output interface: props. In props, callbacks are the output interface. But they delegate that function to events which are emitted by the callbacks.**
** Command handler interface: command object shape (input), system events (output)**

**reuse http://localhost:4000/documentation/graphs/real-world/realworld-high-level-architecture.png to explain how the order of implemntation derives from the architecture, explain that with a nice drawing??** 

- HAVE A MUCH BETTER LOG (console.group!!)
  - would also be great to log guards which are not being satisfied or those who is satisfyed!
- add also in introduction or separate Q&A pages
  - comparison with robot, xstate, stent etc. the best would be to move that to https://github.com/achou11/state-machines
  - explain advantages of implementation techniques (functional vs. imperative, JSON vs. direct exec.)
    - robot nice, but not declarative, exec. inside def, and cannot be unit tested. But if there will be no unit test anyways, then it is fine.
    - or you can use  a model for testing with integration tests, the D.K.Piano way, if that is ever finished 
- REVIEW INTERNAL LINKS, for instance [Specifications section](/real-world.html#Specifications)
  - may not work when published
- do a statechart version of Raect Mosaic, turned into a web component -> Demo web component interface!
  - https://github.com/nomcopter/react-mosaic/blob/master/demo/ExampleApp.tsx
  - or sth similar, it is actually difficult to drag and drop with it...
  - or do react-tree-sortable https://github.com/frontend-collective/react-sortable-tree
    - these are advanced component with state management included, and lots of children complications so interesting
  - or isometric grid, it is catchy and could drive adoption
    - https://github.com/codrops/IsometricGrids
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

# Properties
- cannot sign up if alrady logged in
- cannot see user feed if not logged in

# Bug found (== difference vs. demo app)
- hyperapp
  - logged in users can sign up through iign up page



# user flow
/editor -> https://demo.realworld.io/#/article/implementing-conduit-with-kingly-state-machine-library-n4mhqh

# Quotes
> He recommends that we forget about state and concentrate on behaviour. It’s much easier to understand what an application is doing when using events and commands, because they describe what the application does in a functional way. [](https://www.infoq.com/news/2019/10/event-thinking-microservices/)
