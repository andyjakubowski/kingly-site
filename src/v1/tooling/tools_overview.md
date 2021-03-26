---
title: Overview
type: tooling
order: 0
---

Kingly has a set of productivity- and performance-oriented tools that strives to support you across the stages of the development cycle:
- State machines can be prototyped with the intuitive, industry-grade [yEd graph editor](https://www.yworks.com/products/yed), available on Windows, Linux, and macOS. You may also use an online [browser version](https://www.yworks.com/products/yed-live). The graph editor allows saving graphs under a versionable format for easy management of prototyping iterations.
- In development, yEd state machine modelings can be compiled into a vanilla-JavaScript file that imports the Kingly JavaScript library so you can use the Kingly tooling available in development: configurable logs, [devtool Chrome extension](/v1/tooling/devtool.html).
- In production, state machine modelings created with yEd can be compiled into an optimized zero-dependency vanilla-JavaScript file. The file size oscillates between .5KB for simple machines and 2.5KB for large machines vs. 12KB for the full Kingly library. 

The following sections go into the details of how to install and use the available tooling.
