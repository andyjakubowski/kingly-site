# Github
published as kingly-site, private repository

# Math support
- had to solve an hexo bug with ``` code by adding a webstorm live template called det which expands into <details> <summary> ... 
- had to modify the distribution and make changes in node_modules !!
  - C:\Users\toshiba\WebstormProjects\state-transducer-docs\node_modules\hexo-renderer-mathjax\mathjax.html
  - also C:\Users\toshiba\WebstormProjects\state-transducer-docs\node_modules\hexo-tag-scripture\index.js
  - C:\Users\toshiba\WebstormProjects\state-transducer-docs\node_modules\hexo-renderer-kramed\lib\renderer.js
  - Cf. https://nathaniel.blog/tutorials/make-hexo-support-math-again/
  - + modification of em in kramed/lib/rules/inline.js
    - em: /^\*((?:\*\*|[\s\S])+?)\*(?!\*)/
    - to not use `_` anymore for emphasis/italic
- using kramed instead of marked as markdown renderer
  - https://github.com/hexojs/hexo-math (maybe it is working - haven't tried it - would simplify lots)
  - what i use now: https://nathaniel.blog/tutorials/make-hexo-support-math-again/
  - useful if I go back to use marked!! https://linkinpark213.com/2018/04/24/mathjax/
- added tabbed code block in source and scripts and css (_code)
- added hexo-tag-scripture but modified it to have margin note tufte style
  - style in tufte.styl
- modify commonjs > initVersionSelect for the version dropdown!!

# Markdown
- https://github.github.com/gfm/
