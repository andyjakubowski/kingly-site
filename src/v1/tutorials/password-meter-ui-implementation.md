---
title: Interface implementation
type: tutorials
order: 6
---

Now that we have our state machine, i.e. the controller for our user interface, we need to implement the rest: listening to events, and executing commands, and linking with the machine.

In this simple example, we only have one command, which is to render a screen. The render command has a `params` property with itself two properties: *props* and *screen*. The *screen* property codifies whether we should underline the password field with green or red. The *props* property contains the content of the password field. Armed with this knowledge, it is easy to pick a UI library, or use Vanilla JavaScript and render the appropriate screens. 

In a similar way, you can pick from miscellaneous ways to connect the events to the machine. I used a [300Kb basic event emitter library `emitonoff`](https://github.com/konsumer/emitonoff). You may also use Rxjs, or any other mechanism offered by a UI framework.

We give here various implementations of the interface with different libraries.

## Vanilla js
The Vanilla JavaScript implementation directly updates the DOM, and uses `emitonoff` as event emitter.

The full implementation is available here:
<iframe src="https://codesandbox.io/embed/mqx96pm64j?fontsize=12&module=%2Fsrc%2Findex.js" title="password-meter-nanomorph" style="width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Nanomorph
This implementation uses [nanomorph](https://github.com/choojs/nanomorph) as DOM renderer, and `emitonoff` as event emitter:

```js
[CLICKED_SUBMIT, TYPED_CHAR, START].forEach(event => {
  eventEmitter.on(event, arg => {
    const commands = pwdFsm({ [event]: arg });
    if (commands) {
      commands
        .filter(x => x !== NO_OUTPUT)
        .forEach(({ command, params }) => {
          if (command === RENDER) {
            const { screen, props } = params;
            morph(rootEl, screens[screen](props));
          }
        });
    }
  });
});
```

The full implementation is available here:
<iframe src="https://codesandbox.io/embed/73wy8jwk86?fontsize=12&module=%2Fsrc%2Findex.js" title="password-meter-nanomorph" style="width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## React
**TODO**
**TODO** several implementation switching the emitonoff, and rxjs and then give the stack vanilla/emitonoff stack, nanomorph/emitonoff, react/rxjs stack etc.


## Vue
The Vue implementation relies on a standard `PasswordMeter` Vue component:

```js
export default {
  template: `
     <section v-if="!submittedPassword">
      <label for="password">Enter password</label>
      <input type="password" name="password" id="password" v-on:input="PASSWORD_FIELD_CHANGED" />

      <meter v-if="isUnknown" max="4" id="password-strength-meter"></meter>
      <meter v-else-if="isStrong" max="4" id="password-strength-meter" value="4"></meter>
      <meter v-else="!isStrong" max="4" id="password-strength-meter" value="1"></meter>
      
      <p id="password-strength-text"></p>
      <button v-on:click="PASSWORD_SUBMITTED">Submit</button>
     </section>
    <section v-else="submittedPassword">That's all folks! Submitted password is {{password}}</section>
  `,
  props: ["screen", "input", "password", "next"],
  computed: {
    submittedPassword: function () {
      return this.screen === SUBMITTED_PASSWORD
    },
    isUnknown : function(){
      return this.screen === INIT_SCREEN
    },
    isStrong : function(){
      return this.screen === GREEN_INPUT
    },
  },
  methods: {
    // reminder : do not use fat arrow functions!
    PASSWORD_FIELD_CHANGED: function passwordChangedEventHandler(ev) {
      this.next({ [TYPED_CHAR]: ev.target.value })
    },
    PASSWORD_SUBMITTED: function buttonEventHandler(ev) {
      this.next({ [CLICKED_SUBMIT]: void 0 })
    },
  }
};

```

The full implementation is available here:
<iframe src="https://codesandbox.io/embed/l9o1qknoz7?fontsize=12&module=%2Fsrc%2Findex.js" title="password-meter-nanomorph" style="width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
