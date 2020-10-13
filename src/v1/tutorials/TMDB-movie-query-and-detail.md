---
title: Movie details
type:: tutorials
order: 19
---

Applying the same process of determining control states and extended states, we reach the following final modelization:

{% fig %}
![TMDB with routing](../../graphs/movie-search/TMDB%20routing%20and%20movie%20querying%20and%20movie%20detail%20v2.png)
{% endfig %}


At this level, the equivalent code becomes quite hard to follow, due to branching hell (to make an analogy with callback hell).
