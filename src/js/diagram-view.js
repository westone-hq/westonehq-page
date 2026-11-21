// ── 설계 문서 보기 (diagram-view 조각) ─────────────────────────────────────
// 1) 탭(initTabs): role="tab" 버튼과 aria-controls 패널. 화살표·Home·End 로 옮긴다.
//    진행 방식 6단계([data-proc])와 설계 문서 탭([data-tabs])이 같이 쓴다.
// 2) 다이어그램 틀(.dg): 드래그로 이동, 핀치·버튼·Ctrl+휠·키보드로 확대(1~4배)
//    휠만 굴리면 페이지가 스크롤된다. 링크로 다른 페이지에 가는 동작은 없다

export function initDiagramViews() {
  document.querySelectorAll('[data-tabs]').forEach(initTabs)
  document.querySelectorAll('.dg').forEach(initDiagram)
}

export function initTabs(root) {
  if (root.dataset.tabsInit) return
  // 첫 탭 줄의 탭만 다룬다 (진행 방식 패널 안에 다이어그램 탭이 또 들어 있다)
  const strip = root.querySelector('[role="tablist"]')
  if (!strip) return
  const tabs = [...strip.querySelectorAll(':scope > [role="tab"]')]
  root.dataset.tabsInit = '1'

  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      const panel = document.getElementById(t.getAttribute('aria-controls'))
      if (panel) panel.hidden = !on
    })
    if (focus) tab.focus({ preventScroll: true })
    // 가로로 스크롤되는 좁은 화면: 고른 단계가 줄 안에 보이게
    if (strip.scrollWidth > strip.clientWidth) {
      const r = tab.getBoundingClientRect(), s = strip.getBoundingClientRect()
      if (r.left < s.left || r.right > s.right) strip.scrollLeft += (r.left - s.left) - (s.width - r.width) / 2
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false))
    tab.addEventListener('keydown', (e) => {
      const n = tabs.length
      const next = {
        ArrowRight: tabs[(i + 1) % n], ArrowDown: tabs[(i + 1) % n],
        ArrowLeft: tabs[(i - 1 + n) % n], ArrowUp: tabs[(i - 1 + n) % n],
        Home: tabs[0], End: tabs[n - 1],
      }[e.key]
      if (!next) return
      e.preventDefault()
      select(next, true)
    })
  })

  const first = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]
  if (first) select(first, false)
}

const MIN = 1, MAX = 4

function initDiagram(box) {
  const img = box.querySelector('img')
  if (!img || box.dataset.dgInit) return
  box.dataset.dgInit = '1'
  const ratio = (+img.getAttribute('height') || 1) / (+img.getAttribute('width') || 1)

  const ctrl = document.createElement('div')
  ctrl.className = 'dg-ctrl'
  ctrl.innerHTML =
    '<button type="button" data-z="in" aria-label="확대">+</button>' +
    '<button type="button" data-z="out" aria-label="축소">−</button>' +
    '<button type="button" data-z="fit" aria-label="틀에 맞춤"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>'
  box.appendChild(ctrl)

  // k: 틀 너비에 맞춘 크기 대비 배율, x·y: 틀 안에서 그림 왼쪽 위 위치
  let k = 1, x = 0, y = 0, W = 0, H = 0

  const clamp = () => {
    const w = W * k, h = W * k * ratio
    x = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, x))
    y = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, y))
  }
  const render = () => {
    clamp()
    // 크기는 width 로 바꿔 SVG 가 늘 선명하게 그려지게 하고, 위치만 transform 으로
    img.style.width = `${W * k}px`
    img.style.transform = `translate(${x}px, ${y}px)`
    ctrl.querySelector('[data-z="in"]').disabled = k >= MAX
    ctrl.querySelector('[data-z="out"]').disabled = k <= MIN
  }
  const zoomAt = (nk, px, py) => {
    nk = Math.min(MAX, Math.max(MIN, nk))
    x = px - (px - x) * (nk / k)
    y = py - (py - y) * (nk / k)
    k = nk
    render()
  }
  const fit = () => { k = 1; x = 0; y = 0; render() }
  const measure = () => {
    const pw = W
    W = box.clientWidth; H = box.clientHeight
    if (pw && pw !== W) { x *= W / pw; y *= W / pw }
    render()
  }

  new ResizeObserver(measure).observe(box)

  ctrl.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    if (b.dataset.z === 'fit') fit()
    else zoomAt(k * (b.dataset.z === 'in' ? 1.4 : 1 / 1.4), W / 2, H / 2)
  })

  // ── 포인터: 한 손가락(마우스)은 이동, 두 손가락은 핀치 확대 ──
  const pts = new Map()
  let last = null // { x, y, d } 직전 중심과 손가락 사이 거리
  const center = () => {
    const [a, b] = [...pts.values()]
    if (!b) return { x: a.x, y: a.y, d: 0 }
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) }
  }
  const local = (e) => {
    const r = box.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  box.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.dg-ctrl') || (e.pointerType === 'mouse' && e.button !== 0)) return
    box.setPointerCapture(e.pointerId)
    pts.set(e.pointerId, local(e))
    last = center()
    box.classList.add('grabbing')
  })
  box.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return
    pts.set(e.pointerId, local(e))
    const c = center()
    if (pts.size >= 2 && last.d) {
      x += c.x - last.x; y += c.y - last.y
      zoomAt(k * (c.d / last.d), c.x, c.y)
    } else {
      x += c.x - last.x; y += c.y - last.y
      render()
    }
    last = c
  })
  const up = (e) => {
    if (!pts.delete(e.pointerId)) return
    last = pts.size ? center() : null
    if (!pts.size) box.classList.remove('grabbing')
  }
  box.addEventListener('pointerup', up)
  box.addEventListener('pointercancel', up)

  // 휠: 평소엔 페이지 스크롤. Ctrl/⌘(트랙패드 핀치 포함)일 때만 확대
  box.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const p = local(e)
    zoomAt(k * Math.exp(-e.deltaY * 0.0025), p.x, p.y)
  }, { passive: false })

  // 키보드: +/− 확대, 화살표 이동, 0 맞춤
  box.addEventListener('keydown', (e) => {
    if (e.target !== box) return
    const step = 60
    switch (e.key) {
      case '+': case '=': zoomAt(k * 1.4, W / 2, H / 2); break
      case '-': case '_': zoomAt(k / 1.4, W / 2, H / 2); break
      case '0': fit(); break
      case 'ArrowLeft': x += step; render(); break
      case 'ArrowRight': x -= step; render(); break
      case 'ArrowUp': y += step; render(); break
      case 'ArrowDown': y -= step; render(); break
      default: return
    }
    e.preventDefault()
  })
}
