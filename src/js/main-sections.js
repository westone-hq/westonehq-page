// ── 메인 페이지 섹션 동작 ─────────────────────────────────────────────────
// 1) 함께한 곳: 7곳을 넘으면 흐르는 띠로 바꾼다
// 2) #case-… 링크: 해당 케이스 아코디언을 연다
// 3) 설계 문서 iframe 뷰어: 탭 전환과 지연 로드 (지금은 OTIS 케이스 페이지만 쓴다)

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MARQUEE_FROM = 7 // 이 수를 넘으면 흐르는 띠로 바뀐다

export function initClients() {
  const box = document.getElementById('cl-list')
  const list = box?.querySelector('.cl-items')
  if (!list) return
  const count = list.children.length
  if (count <= MARQUEE_FROM || reduceMotion()) return

  box.classList.add('marquee')
  list.style.setProperty('--dur', `${count * 4}s`)
  const copy = list.cloneNode(true)
  copy.setAttribute('aria-hidden', 'true')
  copy.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'))
  box.appendChild(copy)
}

export function initCaseLinks() {
  const openCase = (hash, { scroll }) => {
    if (!hash || !hash.startsWith('#case-')) return false
    const d = document.getElementById(hash.slice(1))
    if (!d || d.tagName !== 'DETAILS') return false
    d.open = true
    if (scroll) {
      const behavior = reduceMotion() ? 'auto' : 'smooth'
      d.scrollIntoView({ behavior, block: 'start' })
      // 위쪽 항목이 닫히며 높이가 줄어드는 만큼 자리가 밀리면 한 번 더 맞춘다
      setTimeout(() => {
        const top = d.getBoundingClientRect().top
        const want = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
        if (Math.abs(top - want) > 4) d.scrollIntoView({ behavior, block: 'start' })
      }, 360)
    }
    return true
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#case-"]')
    if (!a) return
    const hash = a.getAttribute('href')
    if (openCase(hash, { scroll: true })) {
      e.preventDefault()
      history.pushState(null, '', hash)
    }
  })

  // 다른 페이지에서 index.html#case-… 로 들어왔을 때
  openCase(location.hash, { scroll: false })
  window.addEventListener('hashchange', () => openCase(location.hash, { scroll: false }))
}

export function initUmlViewer() {
  const frame = document.getElementById('uml-frame')
  const openLink = document.getElementById('uml-open')
  const tabs = [...document.querySelectorAll('.uml-tabs [role="tab"]')]
  if (!frame || !tabs.length) return

  const load = () => { if (!frame.getAttribute('src')) frame.src = frame.dataset.src }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        load()
        io.disconnect()
      })
    }, { rootMargin: '200px' })
    io.observe(frame)
  } else {
    load()
  }

  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
    })
    frame.dataset.src = tab.dataset.src
    frame.src = tab.dataset.src
    frame.setAttribute('aria-labelledby', tab.id)
    if (openLink) openLink.href = tab.dataset.src
    if (focus) tab.focus()
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false))
    tab.addEventListener('keydown', (e) => {
      let next = null
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length]
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length]
      else if (e.key === 'Home') next = tabs[0]
      else if (e.key === 'End') next = tabs[tabs.length - 1]
      if (!next) return
      e.preventDefault()
      select(next, true)
    })
  })
}

export function initMainSections() {
  initClients()
  initCaseLinks()
}
