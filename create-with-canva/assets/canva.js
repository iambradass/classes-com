/* ============================================================
   Create with Canva: shared behaviour for the hub, the Prompt Pack
   and the guides. No libraries.

   - Views: every [data-view] section is one "page". The rail, the
     side list and the pager are plain hash links; this shows the
     page that matches the hash and hides the rest.
   - Copy buttons, the share link, steppers.

   Without JS every page simply stacks and everything still reads.
   Loaded as canva.js?v=N. Bump N on EVERY page when this changes.
   ============================================================ */
(function () {
  'use strict'

  var d = document
  var views = [].slice.call(d.querySelectorAll('[data-view]'))
  var navLinks = [].slice.call(d.querySelectorAll('[data-nav] a[href^="#"]'))
  var work = d.querySelector('.cv-work')
  var toastEl = d.querySelector('.cv-toast')
  var toastTimer

  function toast(msg) {
    if (!toastEl) return
    toastEl.textContent = msg
    toastEl.classList.add('is-on')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on') }, 2400)
  }

  /* ---------- views ---------- */
  function indexOfView(id) {
    for (var i = 0; i < views.length; i++) if (views[i].id === id) return i
    return -1
  }

  function show(id, byUser) {
    var idx = indexOfView(id)
    if (idx < 0) return false
    views.forEach(function (v, i) { v.classList.toggle('is-on', i === idx) })
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })
    updatePromptNav(idx)

    if (byUser) {
      /* only pull the page up if its top has scrolled out of view */
      var stick = window.matchMedia('(min-width: 960px)').matches ? 56 : 0
      var y = (work || views[idx]).getBoundingClientRect().top + window.pageYOffset - stick
      if (window.pageYOffset > y) window.scrollTo(0, y)
      var h = views[idx].querySelector('h1, h2')
      if (h) {
        h.setAttribute('tabindex', '-1')
        try { h.focus({ preventScroll: true }) } catch (e) { h.focus() }
      }
    }
    return true
  }

  /* the fixed bottom bar on the Prompt Pack (phones) */
  function updatePromptNav(idx) {
    var bar = d.querySelector('.cv-promptnav')
    if (!bar) return
    var prev = bar.querySelector('[data-prev]')
    var next = bar.querySelector('[data-next]')
    var lab = bar.querySelector('[data-label]')
    function point(a, target) {
      if (!a) return
      if (target) { a.setAttribute('href', '#' + target.id); a.removeAttribute('aria-disabled'); a.removeAttribute('tabindex') }
      else { a.setAttribute('href', '#' + views[idx].id); a.setAttribute('aria-disabled', 'true'); a.setAttribute('tabindex', '-1') }
    }
    point(prev, views[idx - 1])
    point(next, views[idx + 1])
    if (lab) lab.textContent = idx === 0 ? 'Start' : idx + ' of ' + (views.length - 1)
  }

  if (views.length) {
    var first = location.hash.slice(1)
    if (!show(first, false)) show(views[0].id, false)
    window.addEventListener('hashchange', function () {
      show(location.hash.slice(1), true)
    })
  }

  /* ---------- copy ---------- */
  function promptText(box) {
    var src = box.querySelector('[data-copy-src]')
    if (!src) return ''
    var out = []
    ;[].slice.call(src.children).forEach(function (el) {
      /* textContent, not innerText: hidden pages return '' from innerText */
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        var items = [].slice.call(el.children).map(function (li) {
          return '- ' + li.textContent.replace(/\s+/g, ' ').trim()
        })
        out.push(items.join('\n'))
      } else {
        out.push(el.textContent.replace(/\s+/g, ' ').trim())
      }
    })
    return out.join('\n\n')
  }

  function copyText(text, done) {
    function fallback() {
      var ta = d.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.top = '-1000px'
      d.body.appendChild(ta)
      ta.select()
      var ok = false
      try { ok = d.execCommand('copy') } catch (e) {}
      d.body.removeChild(ta)
      done(ok)
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true) }, fallback)
    } else {
      fallback()
    }
  }

  ;[].slice.call(d.querySelectorAll('[data-prompt]')).forEach(function (box) {
    var btn = box.querySelector('.cv-copy')
    if (!btn) return
    var label = btn.querySelector('span')
    var original = label ? label.textContent : ''
    btn.addEventListener('click', function () {
      copyText(promptText(box), function (ok) {
        if (!ok) { toast('Could not copy. Press and hold the text to copy it.'); return }
        btn.classList.add('is-done')
        if (label) label.textContent = 'Copied'
        toast('Copied. Now paste it in.')
        setTimeout(function () {
          btn.classList.remove('is-done')
          if (label) label.textContent = original
        }, 2200)
      })
    })
  })

  var share = d.querySelector('[data-share]')
  if (share) {
    share.addEventListener('click', function () {
      var url = location.origin + location.pathname
      copyText(url, function (ok) {
        toast(ok ? 'Link copied. Paste it in a text or email.' : url)
      })
    })
  }

  /* ---------- steppers ---------- */
  ;[].slice.call(d.querySelectorAll('[data-stepper]')).forEach(function (list) {
    var steps = [].slice.call(list.querySelectorAll('.cv-step'))
    var prog = list.previousElementSibling && list.previousElementSibling.classList.contains('cv-prog')
      ? list.previousElementSibling : null

    function paint() {
      var done = steps.filter(function (s) { return s.classList.contains('is-done') }).length
      if (!prog) return
      var bar = prog.querySelector('i')
      var txt = prog.querySelector('[data-prog-text]')
      if (bar) bar.style.width = Math.round(done / steps.length * 100) + '%'
      if (txt) txt.textContent = done + ' of ' + steps.length + ' done'
    }

    function open(step) {
      steps.forEach(function (s) {
        var on = s === step
        s.classList.toggle('is-open', on)
        var h = s.querySelector('.cv-step-h')
        if (h) h.setAttribute('aria-expanded', on ? 'true' : 'false')
      })
    }

    steps.forEach(function (step, i) {
      var head = step.querySelector('.cv-step-h')
      var next = step.querySelector('.cv-next')
      if (head) head.addEventListener('click', function () {
        if (step.classList.contains('is-open')) {
          step.classList.remove('is-open'); head.setAttribute('aria-expanded', 'false')
        } else open(step)
      })
      if (next) next.addEventListener('click', function () {
        step.classList.add('is-done')
        paint()
        var target = steps[i + 1]
        if (!target) { step.classList.remove('is-open'); head.setAttribute('aria-expanded', 'false'); toast('All done. Nice work.'); return }
        open(target)
        /* wait for the layout to settle before deciding whether to scroll */
        setTimeout(function () {
          var r = target.getBoundingClientRect()
          if (r.top < 64 || r.top > window.innerHeight - 120) {
            window.scrollTo(0, r.top + window.pageYOffset - 80)
          }
        }, 430)
      })
    })
    paint()
  })
})()
