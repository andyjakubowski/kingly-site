(function () {
  initHashLevelRedirects()
  initMobileMenu()
    initVersionSelect()
    initSubHeaders()

  // Most redirects should be specified in Hexo's
  // _config.yml. However, it can't handle hash-level
  // redirects, such as:
  //
  // /foo#hello -> /bar#hello
  //
  // For these cases where a section on one page has
  // moved to a perhaps differently-named section on
  // another page, we need this.
  function initHashLevelRedirects() {
    checkForHashRedirect(/list\.html$/, {
      key: '/v1/guide/list.html#Maintaining-State'
    })
    checkForHashRedirect(/components\.html$/, {
      'What-are-Components': '/v1/guide/components.html',
      'Using-Components': '/v1/guide/components-registration.html',
      'Global-Registration':
        '/v1/guide/components-registration.html#Global-Registration',
      'Local-Registration':
        '/v1/guide/components-registration.html#Local-Registration',
      'Composing-Components':
        '/v1/guide/components.html#Organizing-Components',
      Props:
        '/v1/guide/components.html#Passing-Data-to-Child-Components-with-Props',
      'Passing-Data-with-Props':
        '/v1/guide/components.html#Passing-Data-to-Child-Components-with-Props',
      'camelCase-vs-kebab-case':
        '/v1/guide/components-props.html#Prop-Casing-camelCase-vs-kebab-case',
      'Dynamic-Props':
        '/v1/guide/components-props.html#Static-and-Dynamic-Props',
      'Literal-vs-Dynamic':
        '/v1/guide/components-props.html#Static-and-Dynamic-Props',
      'One-Way-Data-Flow':
        '/v1/guide/components-props.html#One-Way-Data-Flow',
      'Prop-Validation': '/v1/guide/components-props.html#Prop-Validation',
      'Non-Prop-Attributes':
        '/v1/guide/components-props.html#Non-Prop-Attributes',
      'Replacing-Merging-with-Existing-Attributes':
        '/v1/guide/components-props.html#Replacing-Merging-with-Existing-Attributes',
      'Custom-Events':
        '/v1/guide/components.html#Listening-to-Child-Components-Events',
      'Using-v-on-with-Custom-Events':
        '/v1/guide/components.html#Listening-to-Child-Components-Events',
      'Binding-Native-Events-to-Components':
        '/v1/guide/components-custom-events.html#Binding-Native-Events-to-Components',
      'sync-Modifier':
        '/v1/guide/components-custom-events.html#sync-Modifier',
      'Form-Input-Components-using-Custom-Events':
        '/v1/guide/components-custom-events.html#Binding-Native-Events-to-Components',
      'Customizing-Component-v-model':
        '/v1/guide/components-custom-events.html#Customizing-Component-v-model',
      'Non-Parent-Child-Communication': '/v1/guide/state-management.html',
      'Compilation-Scope':
        '/v1/guide/components-slots.html#Compilation-Scope',
      'Single-Slot': '/v1/guide/components-slots.html#Slot-Content',
      'Named-Slots': '/v1/guide/components-slots.html#Named-Slots',
      'Scoped-Slots': '/v1/guide/components-slots.html#Scoped-Slots',
      'Dynamic-Components': '/v1/guide/components.html#Dynamic-Components',
      'keep-alive':
        '/v1/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components',
      Misc: '/v1/guide/components-edge-cases.html',
      'Authoring-Reusable-Components':
        '/v1/guide/components.html#Organizing-Components',
      'Child-Component-Refs':
        '/v1/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements',
      'Async-Components':
        '/v1/guide/components-dynamic-async.html#Async-Components',
      'Advanced-Async-Components':
        '/v1/guide/components-dynamic-async.html#Handling-Loading-State',
      'Component-Naming-Conventions':
        '/v1/guide/components-registration.html#Component-Names',
      'Recursive-Components':
        '/v1/guide/components-edge-cases.html#Recursive-Components',
      'Circular-References-Between-Components':
        '/v1/guide/components-edge-cases.html#Circular-References-Between-Components',
      'Inline-Templates':
        '/v1/guide/components-edge-cases.html#Inline-Templates',
      'X-Templates': '/v1/guide/components-edge-cases.html#X-Templates',
      'Cheap-Static-Components-with-v-once':
        '/v1/guide/components-edge-cases.html#Cheap-Static-Components-with-v-once'
    })
    function checkForHashRedirect(pageRegex, redirects) {
      // Abort if the current page doesn't match the page regex
      if (!pageRegex.test(window.location.pathname)) return

      var redirectPath = redirects[window.location.hash.slice(1)]
      if (redirectPath) {
        window.location.href = window.location.origin + redirectPath
      }
    }
  }

  /**
   * Mobile burger menu button and gesture for toggling sidebar
   */

  function initMobileMenu () {
    var mobileBar = document.getElementById('mobile-bar')
    var sidebar = document.querySelector('.sidebar')
    var menuButton = mobileBar.querySelector('.menu-button')

    menuButton.addEventListener('click', function () {
      sidebar.classList.toggle('open')
    })

    document.body.addEventListener('click', function (e) {
      if (e.target !== menuButton && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open')
      }
    })

    // Toggle sidebar on swipe
    var start = {}, end = {}

    document.body.addEventListener('touchstart', function (e) {
      start.x = e.changedTouches[0].clientX
      start.y = e.changedTouches[0].clientY
    })

    document.body.addEventListener('touchend', function (e) {
      end.y = e.changedTouches[0].clientY
      end.x = e.changedTouches[0].clientX

      var xDiff = end.x - start.x
      var yDiff = end.y - start.y

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && start.x <= 80) sidebar.classList.add('open')
        else sidebar.classList.remove('open')
      }
    })
  }

  /**
   * Doc version select
   */

  function initVersionSelect () {
    // version select
    var versionSelect = document.querySelector('.version-select')
    versionSelect && versionSelect.addEventListener('change', function (e) {
      var version = e.target.value
      var section = window.location.pathname.match(/\/v\d\/(\w+?)\//)[1]
      if (version === 'SELF') return
      window.location.assign(
        'https://' +
        'brucou.github.io/documentation_v' + version + '/v1/' + section + '/'
      )
    })
  }

  /**
   * Sub headers in sidebar
   */

  function initSubHeaders () {
    var each = [].forEach
    var sidebar = document.querySelector('.sidebar')
    var content = document.querySelector('.content')

    // build sidebar
    var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
    if (currentPageAnchor) {
      var allHeaders = []
      var sectionContainer
        sectionContainer = document.createElement('ul')
        sectionContainer.className = 'menu-sub'
        currentPageAnchor.parentNode.appendChild(sectionContainer)
      var headers = content.querySelectorAll('h2')
      if (headers.length) {
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          var h3s = collectH3s(h)
          allHeaders.push(h)
          allHeaders.push.apply(allHeaders, h3s)
          if (h3s.length) {
            sectionContainer.appendChild(makeSubLinks(h3s))
          }
        })
      } else {
        headers = content.querySelectorAll('h3')
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          allHeaders.push(h)
        })
      }

      var animating = false
      sectionContainer.addEventListener('click', function (e) {

        // Not prevent hashchange for smooth-scroll
        // e.preventDefault()

        if (e.target.classList.contains('section-link')) {
          sidebar.classList.remove('open')
          setActive(e.target)
          animating = true
          setTimeout(function () {
            animating = false
          }, 400)
        }
      }, true)

      // make links clickable
      allHeaders
        .filter(function(el) {
          if (!el.querySelector('a')) {
            return false
          }
          var demos = [].slice.call(document.querySelectorAll('demo'))
          return !demos.some(function(demoEl) {
            return demoEl.contains(el)
          })
        })
        .forEach(makeHeaderClickable)

      new SmoothScroll('a[href*="#"]', {
        speed: 400,
        speedAsDuration: true,
        offset: function (anchor, toggle) {
          let dataTypeAttr = anchor.attributes['data-type']
          if(dataTypeAttr && dataTypeAttr.nodeValue === 'theme-product-title') {
            return 300
          }
          return 0
        }
      })
    }

    var hoveredOverSidebar = false
    sidebar.addEventListener('mouseover', function () {
      hoveredOverSidebar = true
    })
    sidebar.addEventListener('mouseleave', function () {
      hoveredOverSidebar = false
    })

    // listen for scroll event to do positioning & highlights
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)

    function updateSidebar () {
      var doc = document.documentElement
      var top = doc && doc.scrollTop || document.body.scrollTop
      if (animating || !allHeaders) return
      var last
      for (var i = 0; i < allHeaders.length; i++) {
        var link = allHeaders[i]
        if (link.offsetTop > top) {
          if (!last) last = link
          break
        } else {
          last = link
        }
      }
      if (last)
        setActive(last.id, !hoveredOverSidebar)
    }

    function makeLink (h) {
      var link = document.createElement('li')
      window.arst = h
      var text = [].slice.call(h.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue
        } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
          return node.textContent
        } else {
          return ''
        }
      }).join('').replace(/\(.*\)$/, '')
      link.innerHTML =
        '<a class="section-link" data-scroll href="#' + h.id + '">' +
          htmlEscape(text) +
        '</a>'
      return link
    }

    function htmlEscape (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function collectH3s (h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== 'H2') {
        if (next.tagName === 'H3') {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    }

    function makeSubLinks (h3s) {
      var container = document.createElement('ul')
      h3s.forEach(function (h) {
        container.appendChild(makeLink(h))
      })
      return container
    }

    function setActive (id, shouldScrollIntoView) {
      var previousActive = sidebar.querySelector('.section-link.active')
      var currentActive = typeof id === 'string'
        ? sidebar.querySelector('.section-link[href="#' + id + '"]')
        : id
      if (currentActive !== previousActive) {
        if (previousActive) previousActive.classList.remove('active')
        currentActive.classList.add('active')
        if (shouldScrollIntoView) {
          var currentPageOffset = currentPageAnchor
            ? currentPageAnchor.offsetTop - 8
            : 0
          var currentActiveOffset = currentActive.offsetTop + currentActive.parentNode.clientHeight
          var sidebarHeight = sidebar.clientHeight
          var currentActiveIsInView = (
            currentActive.offsetTop >= sidebar.scrollTop &&
            currentActiveOffset <= sidebar.scrollTop + sidebarHeight
          )
          var linkNotFurtherThanSidebarHeight = currentActiveOffset - currentPageOffset < sidebarHeight
          var newScrollTop = currentActiveIsInView
            ? sidebar.scrollTop
            : linkNotFurtherThanSidebarHeight
              ? currentPageOffset
              : currentActiveOffset - sidebarHeight
          sidebar.scrollTop = newScrollTop
        }
      }
    }

    function makeHeaderClickable (header) {
      var link = header.querySelector('a')
      link.setAttribute('data-scroll', '')

      // transform DOM structure from
      // `<h2><a></a>Header</a>` to <h2><a>Header</a></h2>`
      // to make the header clickable
      var nodes = Array.prototype.slice.call(header.childNodes)
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]
        if (node !== link) {
          link.appendChild(node)
        }
      }
    }
  }

  // Stolen from: https://github.com/hexojs/hexo-util/blob/master/lib/escape_regexp.js
  function escapeRegExp(str) {
    if (typeof str !== 'string') throw new TypeError('str must be a string!');

    // http://stackoverflow.com/a/6969486
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  // Stolen from: https://github.com/hexojs/hexo-util/blob/master/lib/slugize.js
  function slugize(str, options) {
    if (typeof str !== 'string') throw new TypeError('str must be a string!')
    options = options || {}

    var rControl = /[\u0000-\u001f]/g
    var rSpecial = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]+/g
    var separator = options.separator || '-'
    var escapedSep = escapeRegExp(separator)

    var result = str
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, separator)
      // Remove continuous separators
      .replace(new RegExp(escapedSep + '{2,}', 'g'), separator)
      // Remove prefixing and trailing separators
      .replace(new RegExp('^' + escapedSep + '+|' + escapedSep + '+$', 'g'), '')

    switch (options.transform) {
      case 1:
        return result.toLowerCase()
      case 2:
        return result.toUpperCase()
      default:
        return result
    }
  }
})()
