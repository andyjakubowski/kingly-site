---
title: Chess game - adding features
type: tutorials
order: 11
---

In this section, we are going to add features to our chess application. In the process, we will evaluate the maintainability of a state machine modelling. The new features will also allow us to illustrate how using compound control states decreases the size of our modelling graphs.

## New features' specifications
We will add an info area which will indicate:
- the player who must play next
- a status message indicating whether the game is ongoing, or over

We will also add an action area with:
- a undo button which will return the game to the state it was in the previous move

Follows some screens sample of the application in different states:

|Initial screen|Black turn|
|:---|:---|
|![initial screen](../../images/chess%20game/initial%20position.jpg)|![black turn](../../images/chess%20game/black%20turn.png)|

|White turn - piece selected|White wins|
|:---|:---|
|![white turn](../../images/chess%20game/white%20turn%20-%20white%20piece%20selected.jpg)|![white wins](../../images/chess%20game/white%20wins.png)|

## Modification targets
Remember that the functional design of Kingly encourages implementing a user interface with three modules with non-overlapping concerns:

![kingly-favoured ui architecture](../../graphs/high%20level%20architecture%20ui%20implementation%20with%20kingly.jpg)

The interfaced systems, including the input device (e.g. your laptop or mobile phone) send events to the Kingly machine. The machine computes commands which are executed by command handlers. Those commands may result in API calls on the interfaced systems, whose responses may be processed by the command handler module, which in turn decides whether to send an event back to the machine for processing. This is the architecture that is implemented through the `react-state-driven` library for use within the React ecosystem.

As such, modifying our current chess game implementation potentially implies modifying all, some or none of the three modules.

We will examine these modules one by one and see how adding the new features impact the current code. Let's start with the machine.

### The machine
A modification of the machine behaviour is a modification of the parameters of its factory function, namely:
- states
- events
- initial control state
- initial extended state
- transitions
  - guards
  - action factories
    - extended state updates
    - commands 

The first two added features do not modify the control flow of the machine (i.e. the transitions of the machine). Instead, they involve displaying additional information. The impact thus is limited to the rendering command, which may extend to an impact on the action factories producing those commands. Those factories themselves takes as parameter the extended state of the machine, and the triggering event. The two new features add no new events, hence we are left with examining the possible modifications of the extended state of the machine. To summarize, the impact is limited to all rendering commands, action factories producing rendering commands, and the extended state of the machine.

The *undo* feature introduces a new `Undo` event, corresponding to the new *undo* button. The new behaviour can be described as follows:
- in the absence of *undo* click, the machine behaves as before
- when the user clicks on *undo*:
  - if the machine was in the *White plays* or *White piece selected* control state, then it should move to the *Black plays* control state, its extended state should be the one it had before the move, and the last executed command on the interfaced systems (here the chess engine) should be reversed
  - if the machine was in the *Black plays* or *Black piece selected* control state, then it should move to the *White plays* control state, its extended state should be the one it had before the move, and the last executed command on the interfaced systems (here the chess engine and the output device -- the screen) should be reversed
  - all the previous being true obviously if there was a move to undo in the first place

This gives us the following modelization:

{% tufte %}
The machine modification are emphasized in red. Rendering commands are not represented for the sake of readability.
{% endtufte %}

![](../../graphs/chess%20game%20with%20hierarchy%20with%20undo%20with%20emphasis%20no%20grouping.jpg)  

It turns out that we can simplify our graph. The *Black plays* and *Black piece selected* are the totality of the control states of the compound state *Black turn*. We are going to factor the arrows leaving the two black atomic states into a unique one, linking the *Black turn* control state, and the common target control state *White plays*. We naturally do the same for whites, and the modelization becomes:

![](../../graphs/chess%20game%20with%20hierarchy%20with%20undo%20with%20emphasis.jpg)

If that helps, you can think about it like an application of the good old distributivity law $ab + ac = a(b+c)$ with convenient definition of addition and multiplication operations. The bottom line is that we simplified our graph by reducing the number of edges (transitions) between nodes (control states). 

Why is that a good thing? First of all, this helps visualization. Having less edges to draw gives a clearer graph, which is important to communicate our design. Communicate our design in turn is important to evolve and maintain it. Maintaining 4 edges instead of 2 is more error-prone. Additionally, provided our compound states have some meaning, it reformulates more concisely the behaviour! That helps avoiding errors (say you had 5 control states in the *Black turn* and you forgot to wire one) and finding errors in our machine design (it would be weird if one control state would go to *White piece selected* instead of *White plays*).

There is a last dimension to that. You could have for instance started your design in a top-down manner by identifying the *White turn* and *Black turn* control states, arriving first to this modelization:

![](../../graphs/chess%20game%20with%20hierarchy%20with%20undo%20with%20emphasis%20high%20level.jpg)

This modelization is correct and complete, but less detailed. For instance, if in the *White turn* atomic control state, we have a *Click* event, and that *somehow* indicates a valid move which is not final, then we should indeed go to the *Black turn* atomic state. Our more detailed designed explicits the *somehow* by introducing a second inner state for when a piece has already been clicked. This process by which an atomic state becomes a compound state by introducing sub-states is called *refinement*. We will not say more about this at the moment. This will be the object of a separate tutorial dedicated to modelling techniques. It suffices for now to understand that modelling can be an iterative top-down process by which control states are identified and then refined till a sufficient level of details is reached. 

Back to the subject matter of eliciting targets for modification to implement the new features, we have finished identifying the impact of the *undo* feature on the machine graph. We have a new event for the machine to process. The new transitions will come with new guards and action factories. The action factories should update the extended state of the machine so that it is reversed to its previous value, and produce a new *Undo* command to update the chess engine which implements the game logic. The extended state of the machine may have to be augmented to keep a history of previous moves -- that would impact the *Move* action factories related. 

As a conclusion, as a result of the new features, we need to review all rendering commands, the action factories producing these commands, the extended state of the machine (adding properties to discriminate the player turn and the game status, and keeping a history of previous states), and add two new transitions.

 The updated machine is as follows:

{% tufte %}
We reproduce here only the changes to the state machine. The full history of changes (rendering commands, action factories, etc.) can be observed by comparing with the [code playground](https://glitch.com/~chess-game-basics) from the previous implementation. At the machine level, the changes are the introduction of a new `Undo` event, two new properties to the extended state, and two new transitions.
{% endtufte %}


```js events
const events = [UNDO, BOARD_CLICKED, START];
```

```js initial extended state
const initialExtendedState = {
  (...)
  status: "",
  turn: IS_WHITE_TURN,
};
```

```js transitions
const transitions = [
  (...)
  {
    from: WHITE_TURN, event: UNDO, guards: [
      { predicate: isMoveHistoryNotEmpty, to: BLACK_PLAYS, action: undoMove },
    ]
  },
  {
    from: BLACK_TURN, event: UNDO, guards: [
      { predicate: isMoveHistoryNotEmpty, to: WHITE_PLAYS, action: undoMove },
    ]
  },
];
```


### Interfaced systems
The interfaced systems are two: the chess engine, and the output device (screen).

The chess engine need not change, as it already has all the necessary API to perform the required tasks. Concretely, the chess engine exposes an `.undo` API which undoes the latest move. This is thanks to the great API design of the chess engine which has included features covering all the foreseen use cases for the chess engine.

The screens produced by our application must however be updated so that an event listener is added to the *Undo* button and propagate its click event to the state machine. The component which renders the UI also need to change. Concretely, we now use a `ChessBoardWithInfo` React component:

{% tufte %}
We add two new components `InfoArea` and `ActionArea` to handle the display of the player turn and game status and the undo button. Unlike previously where we did not have control of the `ChessBoard` component, we can use the `next` *props* which is injected by the `<Machine>` component from the `react-state-driven` library to pass events to the machine. 
{% endtufte %}

```js ChessBoardWithInfo
function InfoArea(props) {
  const { status, turn } = props;
  console.log(`status`, status, props)
  const bgColor = turn === IS_WHITE_TURN ? 'white' : 'black';
  return div(".game-info", [
    div(".turn", [strong("Turn")]),
    div("#player-turn-box", { style: { 'backgroundColor': bgColor } }, []),
    div(".game-status", [status])
  ])
}

function ActionArea(props) {
  const {next} = props;
  return figure({onClick : ev => next({UNDO: void 0})}, [
    img(".undo", { src: "https://img.icons8.com/carbon-copy/52/000000/undo.png", alt: "undo" }),
    figcaption([
      strong("Undo")
    ])
  ])
}

function ChessBoardWithInfo(props) {
  console.log(`props`, props)
  const { draggable, width, position, boardStyle, squareStyles, onSquareClick, turn, status, undo, next } = props;
  const chessBoardProps = { draggable, width, position, boardStyle, squareStyles, onSquareClick, undo };
  const infoAreaProps = { turn, status };
  const actionAreaProps = {next};

  console.info(`chessBoardProps`, position);

  return div(".game", [
    div(".game-board", [
      h(Chessboard, chessBoardProps)
    ]),
    h(InfoArea, infoAreaProps),
    h(ActionArea, actionAreaProps)
  ])
}

export default ChessBoardWithInfo

```


### Command handlers
We had two commands in the basic version of the chess game: *Render* and *Move*. We now have the new *Undo* command. Executing this commands simply means executing the `.undo` API of the chess engine:

```js index.js
commandHandlers: {
  (...)
  UNDO_MOVE: function (next, _, effectHandlers) {
    const { chessEngine } = effectHandlers;
    chessEngine.undo();
  }
},
```

### Altogether now
The previously presented pieces are glued together by the `<Machine>` component. The corresponding implementation can be reviewed here:

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 500px; width: 1000px;">
  <iframe
    src="https://glitch.com/embed/#!/embed/chess-game-evolved?path=src/fsm.js&sidebarCollapsed=true&attributionHidden=true&previewSize=40"
    alt="chess-game-basics on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Comparing with a non-state-machine implementation
So we did this with state machines. But how would it be it we would do a simple React application with the standard techniques? Let's have a look at this [chess game demo](http://www.talhaawan.net/react-chess/), which is very similar in features:
 
 ![alternative chess demo](../../images/chess%20game/react%20chess%20image.png)
 
Thereafter follows a summary of the click event handler:

```js
handleClick(i){
    (...)
    if(this.state.sourceSelection === -1){
      if(!squares[i] || squares[i].player !== this.state.player){
        this.setState(...);
        if (squares[i]) {
          squares[i].style = {...squares[i].style, backgroundColor: ""};
        }
      }
      else{
        squares[i].style = {...squares[i].style, backgroundColor: "RGB(111,143,114)"}; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
        this.setState(...);
      }
    }
    else if(this.state.sourceSelection > -1){
      squares[this.state.sourceSelection].style = {...squares[this.state.sourceSelection].style, backgroundColor: ""};
      if(squares[i] && squares[i].player === this.state.player){
        this.setState(...);
      }
      else{
        (...)
        if(isMovePossible && isMoveLegal){
          if(squares[i] !== null){
            if(squares[i].player === 1){
              whiteFallenSoldiers.push(squares[i]);
            }
            else{
              blackFallenSoldiers.push(squares[i]);
            }
          }
          squares[i] = squares[this.state.sourceSelection];
          squares[this.state.sourceSelection] = null;
          let player = this.state.player === 1? 2: 1;
          let turn = this.state.turn === 'white'? 'black' : 'white';
          this.setState(...);
        }
        else{
          this.setState(...);
        }
      }
    }
  }

```

Can you tell at a glance the logic that the click handler implemented? We have a lot of branches -- the [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) is 14! While it is certainly possible to decipher what case each branch handles, in the absence of code comments, it requires looking into the implementation details. Even when you understand the branches logic, you still have to map that logic to the problem space (i.e. how does that connect to the rules of a chess game). For instance this application allows players to continue playing even after the game is over, e.g. it does not have a branch to detect and handle when the game is over. This is hard to guess from the code. Furthermore, how would you go about adding an undo feature?? Modifying that code, requires understanding which branch(es) to modify and the certainty that we do not inadvertently modify the behaviour of the other branches...

In comparison, the control flow implemented by the `if` branches is immediately visible in our state machine. The behaviour of the machine is understandable without reaching for the code. The graph does not give all the details of the implementation but it serves as high-level documentation for the chess application. Code-wise, having a machine that is the direct translation of that graph allows us to access the implementation details immediately, i.e. the machine definition is a low-level, precise documentation for the behaviour. The machine itself being automatically generated from the machine definition, developers cannot mess the implementation of the control flow. As the machine is modified to incorporate new features, the high- and low-level documentation can be automatically or semi-automatically updated, so that there is a [living documentation](https://johnfergusonsmart.com/living-documentation-not-just-test-reports/) of the application.

How easy was it to modify our chess application? Identfying the impact of a new feature is relatively easy. Adding transitions, control states, guards is easy -- they have a localized impact on the rest of the machine. However, changing the extended state potentially impacts the whole machine. In practice, with a good design, the impact area can be narrowed down. We will discuss modelling and modularization techniques in further sections of the tutorial.

## What we learnt
We learnt a lot in this section. 

Compound states introduces a hierarchy of states which helps to hide complexity (the sub-states in the compound state) behind an abstraction layer (the compound state). In the bottom-up design process we followed, we reached a graph with 7 control states, which gives a detailed vision of the chess application behaviour. We also shown how a high-level graph, with only 3 states, can be automatically obtained by simply hiding the content of the compound states. Both visions have their value, and hierarchical state machines allow us to go back and forth between level of details seamlessly.

Furthermore, we shown that compound states allows the designer to simplify the visualization of a model by substituting $n$ transitions by one transition when some conditions apply. That economy is desirable as it helps control the growing complexity that characterizes an iterative development process.

We compared our machine-based interface implementation with a standard implementation and outlined that our implementation facilitates the maintainability of the application. It is easier and faster to understand the behaviour as a result of the visualization of the design, and the separation of concerns realized when breaking down the behaviour in control states, separating logic from effects, and using single-concern functions: guards, action factories, command handlers.

We are also decreasing the surface area of bugs, as an executable version of the machine is generated by Kingly from the machine definition. Provided that Kingly itself is exempt of bugs, the produced machine (i.e. function) is guaranteed to follow the specified definition. 

Additionally, our behaviour model implemented by the machine serves as a living documentation of the specifications of the application's behaviour.

## Exercises
The following exercises should help you check your understanding:
- It would be nice to display the pieces as they are captured in the game. How would you add the feature? **HINT:** the ChessBoard React component [has a *prop*](https://www.chessboardjsx.com/props) to that effect. 
- We can improve on the info area by adding a message when a player is checked. Can you add the feature? **HINT:** the chess engine exposes the `.in_check` API to test the condition. 
- We can improve on the info area by adding a message when the player attempts to make an invalid move. Do you see how to do it?
- The current specification do not allow for undo operations once the game is over. Can you change that so a player can undo also when the game is ended?
