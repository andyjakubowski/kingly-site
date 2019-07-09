---
title: Two-players chess game
type: examples
order: 3
---

## Motivation
This example is a simple user interface, which is used in the [tutorials](../tutorials) section to introduce hierarchical machines. Aside from that, it showcases example of reuse of existing battle-tested components (`ChessBoard` component for displaying a chess game, `chess.js` library to handle the game itself) so the machine only focuses on the UI.

Among the learnings from the example are:

- use of `settings` parameter for dependency injection (chess engine)
- use of history states
- you can do effects in the state machine if you immediately cancel them so that those effects are invisible from outside the machine


## Modelization
![chess game with clock](../../graphs/chess%20game%20with%20hierarchy%20with%20undo%20and%20timer%20highlighted%20with%20init.jpg)

## Implementation
<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 500px; width: 1000px;">
  <iframe
    src="https://glitch.com/embed/#!/embed/chess-game-ultimate?path=src/fsm.js&sidebarCollapsed=true&attributionHidden=true&previewSize=40"
    alt="chess-game-basics on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>
