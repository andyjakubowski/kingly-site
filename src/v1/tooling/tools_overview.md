---
title: Overview
type: tooling
order: 0
---

Kingly has a set of productivity- and performance-oriented tools that strives to support you across the stages of the development cycle:
- State machines can be prototyped with the intuitive, industry-grade [yEd graph editor](https://www.yworks.com/products/yed). The graph editor is a powerful cross-platform desktop application that runs on Windows, Linux, and macOS. You may also use an online [browser version](https://www.yworks.com/products/yed-live). The graph editor allows creating, loading, editing, saving, and exporting a state machine modeling under a versionable XML format that can be compiled into a Kingly state machine.
- In development, state machine modelings created with yEd can be compiled into a vanilla-JavaScript file that imports the Kingly JavaScript library and lets developers use any Kingly tooling available in development. In particular, you can optionally issue log in the development console, or install a Chrome extension that traces the outputs of a state machine.
- In production, state machine modelings created with yEd can be compiled into a zero-dependency vanilla-JavaScript file that weights between .5KB for simple machines and 2.5KB for large machines. Production bundles are as a result smaller than in development --- the Kingly library (between 5 and 12KB depending on tree-shaking) is no longer part of the bundle.

The following sections go into the details of how to install and use the available tooling.
