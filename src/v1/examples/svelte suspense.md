---
title: Svelte Suspense
type: examples
is_new: true
order: 8
---

## Motivation
This example illustrates a simple hierarchical state machine implementing a behaviour similar to React Suspense. It also showcases how a state machine definition can be compiled into a standard standalone JavaScript function -- this is a key motivation behind Kingly's API design. Compiling the machine allows to mostly eliminate the footprint linked to the machine library.

## Modelization 
The suspense functionality can be summarized by the following state machine:

![suspense finite state machine](../../graphs/suspense%20machine.png)

## Implementation
![suspense demo](../../images/suspense/suspense%20demo.gif)

Clone the [GitHub repository](https://github.com/brucou/svelte-suspense-app). 

```bash
npm install
npm run start
```

### Markup and semantics
The main screen which will hold the loaded image is handled with a suspense functionality:

````html
let albums=[];

function fetchAlbums(intents){
  const {done, failed} = intents;
  axios.get(iTunesUrl)
       .then(res => res.data.feed.entry)
       .then(done)
       .catch(failed)
}
 
<div class="app">
    <Header />
    <div class="albums">
        <Suspense task={fetchAlbums} let:data={albums} timeout=10>
            <div slot="fallback" class="album-img">
                <img alt="" src="https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif" />
            </div>
            <div slot="error" class="album-img">
                <h1>ERROR!</h1>
            </div>
            <LazyLoadContainer>
                {#if albums}
                  {#each albums as album, i}
                  <LazyLoad id="{i}">
                      <Album {album} />
                  </LazyLoad >
                  {/each}
                {/if }
            </LazyLoadContainer>
        </Suspense>
    </div>
</div>

````

The default slot content of the `Suspense` component will be immediately put in the DOM and hidden (`display: none`). Two things can happen:

- completion is signalled (`done` or `failed`) before `timeout` milliseconds. In that case, the corresponding slot content (default slot or `error` slot) is displayed as soon as the completion signal is processed
- completion is not signalled before `timeout` milliseconds expires. In that case, the fallback content (e.g. the `fallback` slot content) will be displayed. When the default slot content signals completion, it will be displayed. When completion is signalled (`done` or `failed`), the corresponding slot content (default slot or `error` slot) is displayed as soon as the completion signal is processed
 
The `Album` component also benefits from the suspense functionality:

```javascript
<ul class="album">
    <li class="album-item">
        <Suspense let:intents={{done, failed}} timeout=0 >
            <div slot="fallback" class="album-img">
                <img alt="loading" src="https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif" />
            </div>
            <a href={link} target="blank" class="link">
                <img class="album-img"
                     on:load="{done}"
                     src={image}
                     alt={'itunes' + Math.random()} />
            </a>
        </Suspense>
    </li>
    <li class="title album-item">
        <a href={link} target="blank" class="link">
            {title.slice(0, 20)}..</a></li>
    <li class="price album-item">Price:{price}</li>
    <li class="date album-item">Released:{formatDate(date, "MMM Do YY")}</li>
</ul>
```

### API
The `Suspense` component admits the following props:
- `timeout`: the number of milliseconds to wait before displaying the fallback slot content
- `task`: a function to run on starting the `Suspense` component. That function will receive an object parameter `{done, failed}` which can be used to indicate termination or failure to the underlying suspense state machine. 

The `Suspense` component also passes on the `intents` parameter to its children slots. The aforementioned parameter is an object with properties `{done, failed}` which can be used to indicate termination or failure to the underlying suspense state machine. Both properties are function which can also pass event data if necessary.  

For instance, in the previous example, the `Album` component lazily loads an image. When the image is loaded, completion is signaled and the wrapping `<a>` DOM element is displayed. In this example, there is no need to pass data with the `done` or `failed` events. 

In the previous example too, in the main `App` component, the list of albums is fetched, using the `task` parameter of the `Suspense` component. When that is completed, the completion signal with the fetched albums as data is sent to the `Suspense` component and the album list is displayed. 

## Takeaways
Kingly machines can be compiled to standard standalone JavaScript functions. The size of the Kingly library is in this case become much less relevant. Kingly takes inspiration here from [Svelte](https://svelte.dev/), the front-end framework which compiles itself away.

While using a formalized state machine may feel like too much for a simple behaviour like Suspense, the technique can however be generalized easily to more complex scenarios -- only by modifying the underlying machine. Using a Kingly state machine with Svelte is likely to improve Svelte's testing history, which is mostly based on end-to-end tests. A Svelte component is a sum of behaviour, style and content. If the behaviour is implemented with a Kingly machine, input sequences for the machine can be generated automatically, and testing can be performed independently of the browser or Svelte. 
 
## Credit
The example is inspired from [previous work](https://reactgo.com/tutorial-reactlazy-react-suspense/) by [Sai gowtham](https://twitter.com/saigowthamr).
