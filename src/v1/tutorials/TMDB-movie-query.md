---
title: Movie query
type: tutorials
order: 18
---

We have by now handled the initial routing event and the displaying of a loading screen and querying of the TMDB database. Let's continue our mapping efforts as per specifications:

|Event|Commands|
|:---|:---|
|`ROUTE_CHANGED`|None. Routing is handled higher in the hierarchy.|
|`QUERY_CHANGED`|We should display again a loading screen, query anew the database, and update the browser's url|
|`SEARCH_RESULTS_RECEIVED`|We should display those results. The small trap to avoid is not to display the wrong results. Because we may have several queries in-flight, we have to check that the results we received correspond to the latest query performed.|
|`SEARCH_ERROR_RECEIVED`|We should display the error screen. As before, we may have several queries in-flight, we have to check that the error we received correspond to the latest query performed.|
|`MOVIE_SELECTED`| We should query the database for the movie details but only if the event corresponds to an action the user can perform in the first place, i.e when movies have already been displayed.|
|`MOVIE_DETAILS_DESELECTED`|None. This event cannot be received if the movie details screen has not been shown.| 
|`SEARCH_RESULTS_MOVIE_RECEIVED`|None. This event cannot be received if no corresponding query has been performed.|
|`SEARCH_ERROR_MOVIE_RECEIVED`|None. This event cannot be received if no corresponding query has been performed.|

The first two events do not require anything special to handle. 

For `SEARCH_RESULTS_RECEIVED` and `SEARCH_ERROR_RECEIVED`, we need to know which is the latest in-flight query. For the same event, we have two different possible set of commands: we have a piece of state! As we said before, that piece of state can be either in the form of control states or part of the extended state. If we created new control states to handle those events, the posterior computations would be quite similar. Extended state is a better choice here. A guard, appropriately called `isLatest`, will help handle the differentiated treatment.

On the other hand, the `MOVIE_SELECTED` event leads to two possible set of commands: we have a piece of state! Control state or extended state? If results are not displayed, there is no commands to execute and the subsequent behaviour of the interface on subsequent events do not change vs. before receiving the event. Conversely, if results are displayed, and the user triggers the event, the behaviour is significantly different: we must query anew the database, display a loading screen, and so on. Using control states is a better choice.

Iterating on the list of accepted events, we eventually reach the following modelization:
![TMDB with routing](../../graphs/movie-search/TMDB%20routing%20and%20movie%20querying%20v2.png)

Review the modelization and check we are indeed fulfilling additional portions of our specifications related to reaching the screen displaying the details of a specific movie. 

Let's finalize our refinement process. We still have a `shouldProcess` to explicitate for the *Movie detail* control state.
