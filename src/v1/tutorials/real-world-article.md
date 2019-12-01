---
title: Article route 
type: tutorials
order: 37
---

**TODO**

In this section, we will modelize and implement the user flows related to the *Article* route. In that route, the navigating user can view an article's content. If the navigating user is also the article's author, he can edit or delete the article. Otherwise, he can follow the article's author and like/unlike the article. In all cases, the navigating user can additionally post comments about the article, and can delete the comments he posted.

An example of article route is as follows: `/#/article/real-worl-editor-9zlwb7`.

The user needs not be authenticated to access the *Article* route and its functionalities. However, if the user tries to follow or like/unlike an article's author, he will be redirected to the *Sign up* route. Additionally, if the user is not authenticated, he cannot post comments.

## UI
We already have identified the screens in the *Specifications* section. Ler's remind them here:

{% fullwidth %}

|Route|State|Main screen|
|:---|:---|:---:|
|`#/article/real-world-is-cool-dtp7j9`|Not authenticated, article chosen|![Not authenticated, viewing article](https://imgur.com/sA8KY8u.png)|
|`#/article/real-world-is-cool-dtp7j9`|Authenticated, article chosen, not my article|![Authenticated, article chosen](https://imgur.com/Fa7cCjj.png)|
|`#/article/desktop-game-editor-...-soioli`|Authenticated, article chosen, my article, comment posted|![Authenticated, article chosen, my article](https://imgur.com/HFK92k3.png)|

{% endfullwidth %}

The UI for the *Article* route will be implemented with a *Article* Svelte component. The [full source code](https://github.com/brucou/realworld-kingly-svelte/blob/with-article-route/src/UI/Article.svelte) for the `Article` component can be accessed in the repository.

**TODO: I am here**; do the UI

## UI testing
As before, we test the UI with [Storybook](https://storybook.js.org/). The [corresponding stories](https://github.com/brucou/realworld-kingly-svelte/tree/with-article-route/stories) are available in the source repository.

## Events
We have the following events for the *Article* route:

{% fullwidth %}
| Event | Event data |Occurs when|
|:---|:---|:---|
|`ROUTE_CHANGED`| hash | user clicks on a link (direct linking or redirection for authentication) |
|`ARTICLES_FETCHED_OK`| articles data as [returned by the API](https://github.com/gothinkster/realworld/tree/master/api#multiple-articles)| articles fetch API call executed successfully|
|`ARTICLES_FETCHED_NOK`|error|articles fetch API call failed|
|`CLICKED_PAGE`|page index|user clicks on a page number in the pagination section|
|`TOGGLED_FAVORITE`|article's slug and whether the article is favorited at the moment of the toggling|user clicks to like or unlike an article|
|`FAVORITE_OK`|article and slug data|article was successfully liked by the user|
|`FAVORITE_NOK`|error and slug data|user failed to like the article|
|`UNFAVORITE_OK`|article and slug data|article was successfully unliked by the user|
|`UNFAVORITE_NOK`|error and slug data|user failed to unlike the article|
|`TOGGLED_FOLLOW`|username to follow, and whether that username is followed at the time of the toggling|user clicks to follow or unfollow a user|
|`FOLLOW_OK`|followed profile data|user successfully followed a profile|
|`FOLLOW_NOK`|err and profile data|user failed to follow a profile|
|`UNFOLLOW_OK`|unfollowed profile data|user successfully unfollowed a profile|
|`UNFOLLOW_NOK`|err and profile data|user failed to unfollow a profile|
|`FETCHED_PROFILE`|profile data|api response to a *Get profile* request|
|`FETCH_PROFILE_NOK`|error|api error response to a *Get profile* request|
{% endfullwidth %}

## Commands
  fetchArticle,
  fetchComments,
  deleteComment,
  createComment,
  deleteArticle


We have the following commands for the *User profile* route (some of which also being used for the *Home* route):

| Command | Command parameters |Description|
|:---|:---|:---|
| `REDIRECT`| hash to redirect to| redirects the user to a new/same hash location| 
| `FETCH_AUTHENTICATION`| -- | fetches user session data if any| 
| `FAVORITE_ARTICLE`| article slug| sends an [API request](https://github.com/gothinkster/realworld/tree/master/api#favorite-article) to like an article| 
| `UNFAVORITE_ARTICLE`| article slug| sends an [API request](https://github.com/gothinkster/realworld/tree/master/api#unfavorite-article) to unlike an article| 
| `FETCH_PROFILE`| username | sends an API request to the [*Get profile* end point](https://github.com/gothinkster/realworld/tree/master/api#get-profile)|
| `FOLLOW_PROFILE`| username | sends an API request to the [*Follow user* end point](https://github.com/gothinkster/realworld/tree/master/api#follow-user)|
| `UNFOLLOW_PROFILE`| username | sends an API request to the [*Unfollow user* end point](https://github.com/gothinkster/realworld/tree/master/api#unfollow-user)|
| `FETCH_AUTHOR_FEED`| articles' author's username and page index | sends an API request to the [*List Articles* end point](https://github.com/gothinkster/realworld/tree/master/api#list-articles)|

