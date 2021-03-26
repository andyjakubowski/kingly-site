---
title: Why Kingly
type: tutorials
order: 0
---

Kingly is a state machine library to specify the **behavior** of applications. Kingly complements tools that specify the **appearance** of applications (e.g., Sketch, Figma). It is designed to be used in conjunction with **any user interface library or framework** (e.g., React, Vue, Svelte, or plain JavaScript). You can use it to describe the behavior of one component of your application, or have it take over the whole application. 

Your application behavior is what the application **should do** in response to the events it receives -- from the user, the network, and any other systems the application interfaces with. It computes the application response, it does not perform that response. Kingly [will never send emails](http://www.catb.org/jargon/html/Z/Zawinskis-Law.html).

Kingly lets you **draw** your application response to events with a [professional graph editor](https://www.yworks.com/products/yed). Here is the drawn behavior of a wizard form that manages a user subscription process:

![User application process](../../graphs/sparks%20application%20process%20with%20comeback%20proper%20syntax%20hierarchical%20fsm.png)

It ressembles the original user flows (see how the green paths match):

{% fig %}
![User application process: user flow](https://imgur.com/xcO9xnY.jpg)
{% endfig %}

except that with Kingly's visual language, it can be made precise enough that a JavaScript implementation can be **automatically generated** from the graph. If you got the drawing right, the generated code will also be correct. You can **focus on what your application does**, separately from how you are going to do it.

You can quickly iterate on the modeling of the application behavior, knowing that the generated code will be kept in sync. The drawn model, like your code, is versionable. You can go back to any versions at any time.

You won't break your budget. Kingly has a [compiler](http://localhost:4000/documentation/v1/tooling/compiling.html) that gets the implementation of your application behavior between 0.5 and 3 KB. The behavior for the wizard form previously shown was compiled down to 0.7 KB.

The net result is a productive development process resulting in **robust, maintainable, visually self-documented applications and components**. At near zero bundle cost.

Did you get interested? Let's [get started](http://localhost:4000/documentation/v1/tutorials/installation.html).
