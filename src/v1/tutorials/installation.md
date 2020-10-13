---
title: Installation
type: tutorials
order: 2
version: 0.28
min_gz: "11"
library: kingly
---

## Browser compatibility
Kingly API exposes a `makeWebComponentFromFSM` function requiring [custom-elements V1](https://developers.google.com/web/fundamentals/web-components/customelements) support, which is supported by [most browsers](https://caniuse.com/#feat=custom-elementsv1) .

## Release Notes
Latest stable version: {{version}}

See release notes on [GitHub](https://github.com/brucou/kingly/releases).

## Global `<script>` Include
It is possible to directly include the library in a script tag in the browser. `Kingly` will be registered as a global variable.

For prototyping or learning purposes, you can use the latest version with:

``` html
<script src="https://cdn.jsdelivr.net/npm/kingly"></script>
```

For production, we recommend linking to a specific version number and build to avoid unexpected breakage from newer versions:

``` html
<script src="https://cdn.jsdelivr.net/npm/kingly@0.28.0/dist/kingly.umd.min.js"></script>
```

Note that the Kingly library will not throw when it encounters unexpected situations. It will instead return an error object. I consider the present core API pretty much final. Future changes should add, and not remove or modify the current features. 

If you are using native ES Modules, there is also an ES Modules compatible build:

``` html
<script type="module">
  import {createStateMachine, makeWebComponentFromFsm, decorateWithEntryActions, traceFSM} from 
  'https://cdn.jsdelivr.net/npm/kingly@0.19.0/dist/kingly.es.min.js'
</script>
```

## NPM

``` bash
$ npm install kingly
```

## AMD

All UMD builds can be used directly as an AMD module.
