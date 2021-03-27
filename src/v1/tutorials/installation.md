---
title: Get started
type: tutorials
order: 2
version: 0.29
min_gz: "11"
library: kingly
---

{% ptip %}
This section provides an overview of the Kingly documentation and related resources. Feel free to come back to it anytime that you are looking for specific information.
{% endptip %}

Kingly is a JavaScript library to declaratively describe the behavior of applications. 

- [Why Kingly?](./index.html)
- [Try Kingly](#Install)
- [Learn Kingly](#Learn-Kingly)
- [API reference](../api/index.html)
- [Tutorials](./counter-application.html)
- [Tooling ecosystem](../tooling/tools_overview.html)
- [Staying informed](#Staying-Informed)
- [Something missing?](#Feedback)

## Install
Kingly can be installed from `npm`. The Kingly package provides an ESM build and an UMD build. 

### NPM

``` bash
$ npm install kingly
```

### Global `<script>` Include
It is possible to directly include the library in a script tag in the browser. `Kingly` will then be registered as a global variable.

For prototyping or learning purposes, you can use the latest version with:

``` html
<script src="https://cdn.jsdelivr.net/npm/kingly"></script>
```

For production, we recommend linking to a specific version number:

``` html
<script src="https://cdn.jsdelivr.net/npm/kingly@0.28.0/dist/kingly.umd.min.js"></script>
```

If you are using native ES Modules, there is also an ES Modules compatible build:

``` html
<script type="module">
  import {createStateMachine, makeWebComponentFromFsm, decorateWithEntryActions, traceFSM} from 
  'https://cdn.jsdelivr.net/npm/kingly@0.19.0/dist/kingly.es.min.js'
</script>
```

### AMD

All UMD builds can be used directly as an AMD module.

### Browser compatibility
Kingly's API exposes a `makeWebComponentFromFSM` function requiring [custom-elements V1](https://developers.google.com/web/fundamentals/web-components/customelements) support, which is provided by [most browsers](https://caniuse.com/#feat=custom-elementsv1).

### Release Notes
Latest stable version: {{version}}

See release notes on [GitHub](https://github.com/brucou/kingly/releases).

## Learn Kingly
Kingly describe the behavior of applications with state machines. What are state machines? How can state machines describe behavior? How to use Kingly within a development workflow? There are several ways to answer these questions. 

If you would like a more theoretical, high-level understanding of the subject, go to [*Concepts and architecture*](../concepts).

If you prefer to learn concepts step by step, start with the [tutorials](./counter-application.html). The tutorials strive to start really slowly with a trivial counter application, up to the implementation of a medium-sized application. 

Like anything new or unfamiliar, Kingly has a learning curve. It is however designed to be simple. It also [strives to be easy](https://paulrcook.com/simple-made-easy) once the required mental model is acquired. Do not despair if you encounter difficulties and [keep in touch with 
the development team](https://github.com/brucou/kingly/issues/new) if you have any questions/feedback. Relentless and stubborn practice (and a ton of coffee) are behind any good software.

## Feedback
[Leave us your feedback on Github](https://github.com/brucou/kingly/issues/new) if you would like us to document topics that are currently not addressed or if you found anything incorrect. We love to hear from you.

## Staying informed
![](../../images/coming-soon/pngkit_under-construction-sign-png_880130.png)
