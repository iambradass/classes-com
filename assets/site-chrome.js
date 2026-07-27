/* ============================================================
   CNAT Education shared site chrome.

   Drop ONE line into any page and it gains the site header, a
   breadcrumb, and a foot block that gets people back to the library:

     <script src="/assets/site-chrome.js" defer
             data-crumb="Keeping AI on Things|/keeping-ai-on-things/"
             data-title="The Farm Watchlist"
             data-class="Keeping AI on Things"></script>

   Every attribute is optional. With none of them you still get the
   header and a plain "back to the library" foot.

   The header is deliberately NOT sticky: several of these pages have
   their own sticky headers, and a second sticky bar fights them for
   the top of the screen. Getting back is handled at both ends: the
   strip at the top and the return block at the bottom.
   ============================================================ */
(function () {
  'use strict'

  var me = document.currentScript
  if (!me) {
    var all = document.querySelectorAll('script[src*="site-chrome.js"]')
    me = all[all.length - 1]
  }
  var cfg = (me && me.dataset) || {}
  var LIB = '/resources/'

  /* ---------- styles ---------- */
  var css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = '/assets/site-chrome.css'
  document.head.appendChild(css)

  var NAV = [
    { href: '/', label: 'Home' },
    { href: '/#catalog', label: 'Courses' },
    { href: LIB, label: 'Resources' },
    { href: '/#contact', label: 'Contact' }
  ]

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (html != null) n.innerHTML = html
    return n
  }

  /* ---------- header ---------- */
  /* Several of these pages already carry a CNAT brand header of their own.
     Repeating the logo directly above it looks like a mistake, so on those
     pages the strip drops the brand and reads as a utility bar instead. */
  function hasOwnBrand() {
    /* match on the element, not the src: the AI Builds manual embeds its logo
       as a data URI, so looking for "cnat-logo" in the path missed it */
    return !!document.querySelector('header img, .nav img, .top img, .site-row img, .hero img')
  }

  function buildHeader() {
    var here = location.pathname.replace(/\/+$/, '/') || '/'
    var links = NAV.map(function (n) {
      var on = n.href === LIB && here.indexOf('/resources') === 0
      return '<a class="cn-ch-link' + (on ? ' on' : '') + '" href="' + n.href + '"' +
        (on ? ' aria-current="page"' : '') + '>' + n.label + '</a>'
    }).join('')

    var brand = hasOwnBrand()
      ? '<a class="cn-ch-brand cn-ch-brand--text" href="/">CNAT Education</a>'
      : '<a class="cn-ch-brand" href="/">' +
          '<img src="/img/cnat-logo-white.png" alt="CNAT Title" width="26" height="26">' +
          '<span>Education</span></a>'

    var bar = el('div', 'cn-ch-bar' + (hasOwnBrand() ? ' cn-ch-bar--utility' : ''))
    bar.innerHTML =
      '<div class="cn-ch-in">' + brand +
        '<nav class="cn-ch-nav" aria-label="Site">' + links + '</nav>' +
      '</div>'
    return bar
  }

  /* ---------- breadcrumb ---------- */
  function buildCrumbs() {
    if (!cfg.crumb && !cfg.title) return null
    var parts = [{ label: 'Home', href: '/' }, { label: 'Resources', href: LIB }]
    if (cfg.crumb) {
      var bits = cfg.crumb.split('|')
      parts.push({ label: bits[0], href: bits[1] || null })
    }
    var html = parts.map(function (p) {
      return p.href
        ? '<a href="' + esc(p.href) + '">' + esc(p.label) + '</a>'
        : '<span>' + esc(p.label) + '</span>'
    }).join('<span class="cn-ch-sep" aria-hidden="true">&rsaquo;</span>')
    if (cfg.title) {
      html += '<span class="cn-ch-sep" aria-hidden="true">&rsaquo;</span>' +
              '<span class="cn-ch-here" aria-current="page">' + esc(cfg.title) + '</span>'
    }
    var wrap = el('nav', 'cn-ch-crumbs', '<div class="cn-ch-in">' + html + '</div>')
    wrap.setAttribute('aria-label', 'Breadcrumb')
    return wrap
  }

  /* ---------- foot: back to the library, plus siblings ---------- */
  function related() {
    var all = window.CNAT_RESOURCES
    if (!all || !cfg.class) return []
    var herePath = location.pathname.replace(/\/+$/, '')
    return all.filter(function (r) {
      var rp = String(r.u).split('#')[0].replace(/\/+$/, '')
      return r.c === cfg.class && rp !== herePath
    }).slice(0, 3)
  }

  function buildFoot() {
    var foot = el('div', 'cn-ch-foot')
    var more = related()
    var html = '<div class="cn-ch-in">'

    if (more.length) {
      html += '<p class="cn-ch-lab">More from ' + esc(cfg.class) + '</p><div class="cn-ch-more">'
      html += more.map(function (r) {
        return '<a class="cn-ch-card" href="' + esc(r.u) + '">' +
          '<span class="cn-ch-kind">' + esc(r.k) + '</span>' +
          '<span class="cn-ch-t">' + esc(r.t) + '</span>' +
          '<span class="cn-ch-d">' + esc(r.d) + '</span></a>'
      }).join('')
      html += '</div>'
    }

    var libHref = cfg.class ? LIB + '?class=' + encodeURIComponent(cfg.class) : LIB
    html +=
      '<div class="cn-ch-actions">' +
        '<a class="cn-ch-btn" href="' + libHref + '">Back to the resource library</a>' +
        '<a class="cn-ch-ghost" href="/">CNAT Education home</a>' +
      '</div>' +
      '<p class="cn-ch-fine">Questions about a class? ' +
        '<a href="mailto:info@cnattitle.com">info@cnattitle.com</a> ' +
        '&middot; TREC Provider #10034</p>' +
      '</div>'

    foot.innerHTML = html
    return foot
  }

  /* ---------- mount ---------- */
  function mount() {
    if (document.querySelector('.cn-ch-bar')) return

    var skip = el('a', 'cn-ch-skip', 'Skip to the main content')
    skip.href = '#cn-main'

    var head = buildHeader()
    var crumbs = buildCrumbs()

    document.body.insertBefore(head, document.body.firstChild)
    document.body.insertBefore(skip, head)
    if (crumbs) document.body.insertBefore(crumbs, head.nextSibling)

    /* give the skip link a target even on pages with no <main> */
    var target = document.querySelector('main, [role="main"]') ||
                 (crumbs ? crumbs.nextElementSibling : head.nextElementSibling)
    if (target && !document.getElementById('cn-main')) {
      target.id = 'cn-main'
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    }

    document.body.appendChild(buildFoot())
  }

  function start() {
    /* the catalogue is optional: without it the foot simply has no siblings */
    if (cfg.class && !window.CNAT_RESOURCES) {
      var s = document.createElement('script')
      s.src = '/assets/resources.js'
      s.onload = mount
      s.onerror = mount
      document.head.appendChild(s)
      return
    }
    mount()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
