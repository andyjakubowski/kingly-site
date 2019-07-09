---
title: Visualizer
type: contributed
order: 2
---

The Kingly library includes two helpers for visualization of a Kingly machine:

- conversion to plantUML: `toPlantUml :: FSM_Def -> PlantUml`.
  - the resulting chain of characters can be pasted in [plantText](https://www.planttext.com/) or [plantUML previewer](http://sujoyu.github.io/plantuml-previewer/) to get an automated graph representation. Both will produce the exact same visual representation.
- conversion to [online visualizer](https://github.com/brucou/state-transducer-visualizer) format (dagre layout engine): for instructions, cf. github directory: `toDagreVisualizerFormat :: FSM_Def -> JSON`

![visualization example](https://github.com/brucou/state-transducer-visualizer/raw/master/assets/cd-player-automatic-dagre-visualization.png)

Automated visualization works well with simple graphs, but seems to encounter trouble to generate optimally satisfying complex graphs. The Dagre layout seems to be a least worse option. I believe the best option for visualization is to use professional specialized tooling such as `yed`. In a future version, we will provide a conversion to `yed` graph format to facilitate such workflow. The [`yed`](https://www.yworks.com/products/yed) orthogonal and flowchart layout seem to give pretty good results.

The conversion functions will be moved to their own packages in future versions with a proper documentation.
 
![](../../images/coming-soon/under-construction-png-images-label-free-download-660574.png)
