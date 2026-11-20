// ── 히어로 도면 ───────────────────────────────────────────────────────────
// 제목 문구(HTML에 직접 쓴 .ph 링크) 아래에 기준선·눈금·지시선·주석을 SVG로 그린다.
// 문구에 마우스를 올리거나 초점을 주면 그 구간이 초록으로 강조되고,
// 누르면 연결된 패키지 카드(data-keys)를 잠깐 반짝인다.

const NS = 'http://www.w3.org/2000/svg'

export function initHeroBlueprint() {
  const ttl = document.getElementById('hero-title')
  const box = document.getElementById('bp-box')
  const svg = document.getElementById('bp-svg')
  if (!ttl || !box || !svg) return

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const phs = [...ttl.querySelectorAll('.ph')]
  phs.forEach((ph, i) => { ph.dataset.i = i })

  const mk = (tag, attrs, parent = svg) => {
    const el = document.createElementNS(NS, tag)
    for (const k in attrs) el.setAttribute(k, attrs[k])
    parent.appendChild(el)
    return el
  }

  // 선이 그려지는 애니메이션
  const stroke = (el, delay, duration) => {
    const len = el.getTotalLength()
    el.style.strokeDasharray = len
    el.style.strokeDashoffset = len
    el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration, delay, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
      .finished.then(() => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = '' })
      .catch(() => {})
  }
  const appear = (el, delay) => {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay, fill: 'backwards' })
  }

  let first = true
  let current = null

  function draw() {
    svg.replaceChildren()
    // 640px 이하에서는 SVG가 숨겨진다. 잴 필요가 없다.
    if (getComputedStyle(svg).display === 'none') { first = false; return }

    const B = box.getBoundingClientRect()
    const pad = 40
    Object.assign(svg.style, {
      left: -pad + 'px', top: -pad + 'px',
      width: B.width + pad * 2 + 'px', height: B.height + pad * 2 + 'px',
    })
    svg.setAttribute('viewBox', `${-pad} ${-pad} ${B.width + pad * 2} ${B.height + pad * 2}`)

    const rel = r => ({ x: r.left - B.left, y: r.top - B.top, w: r.width, h: r.height })
    // 줄이 떠오르는 중(translateY)에 재도 제자리를 기준으로 그리도록 이동량을 뺀다
    const shiftOf = ln => { const t = getComputedStyle(ln).transform; return t && t !== 'none' ? new DOMMatrix(t).m42 : 0 }
    const rectOf = (node, dy) => {
      const rg = document.createRange(); rg.selectNodeContents(node)
      const r = rel(rg.getBoundingClientRect()); r.y -= dy; return r
    }
    const fs = parseFloat(getComputedStyle(ttl).fontSize)
    const anim = first && !still
    let baseDelay = 150   // 기준선: 0.15초부터 줄마다 0.14초
    let noteDelay = 1000  // 주석: 1초부터 문구마다 0.16초

    ttl.querySelectorAll('.ln').forEach(ln => {
      const dy = shiftOf(ln)
      const r = rectOf(ln, dy)
      const y = r.y + r.h / 2 + fs * 0.36 + 10
      const base = mk('path', { d: `M${r.x - 14},${y} H${r.x + r.w + 14}`, class: 'bp-base' })
      if (anim) stroke(base, baseDelay, 900)

      ln.querySelectorAll('.ph').forEach(ph => {
        const q = rectOf(ph, dy)
        const xa = q.x + 2, xb = q.x + q.w - 2, mid = (xa + xb) / 2
        const g = mk('g', { class: 'bp-g', 'data-i': ph.dataset.i })
        if (+ph.dataset.i === current) g.classList.add('on')

        mk('path', { d: `M${xa},${y} H${xb}`, class: 'bp-seg' }, g)
        ;[xa, xb].forEach(x => {
          const tick = mk('path', { d: `M${x},${y - 5} V${y + 5}`, class: 'bp-end' }, g)
          if (anim) appear(tick, baseDelay + 650)
        })
        const lead = mk('path', { d: `M${mid},${y} V${y + 11}`, class: 'bp-lead' }, g)
        if (anim) stroke(lead, noteDelay, 200)

        const note = mk('text', { x: mid + 5, y: y + 27, 'text-anchor': 'middle', class: 'bp-note' }, g)
        note.textContent = ph.dataset.note || ''
        const bb = note.getBBox()
        const dot = mk('circle', { cx: bb.x - 7, cy: bb.y + bb.height / 2, r: 2.6, class: 'bp-dot' }, g)
        if (anim) { appear(note, noteDelay + 180); appear(dot, noteDelay + 180) }
        noteDelay += 160
      })
      baseDelay += 140
    })
    first = false
  }

  function focusPh(i) {
    current = i
    ttl.classList.toggle('pointing', i !== null)
    phs.forEach(p => p.classList.toggle('on', +p.dataset.i === i))
    svg.querySelectorAll('.bp-g').forEach(g => g.classList.toggle('on', +g.dataset.i === i))
  }

  phs.forEach(p => {
    const i = +p.dataset.i
    p.addEventListener('pointerenter', () => focusPh(i))
    p.addEventListener('pointerleave', () => { if (document.activeElement !== p) focusPh(null) })
    p.addEventListener('focus', () => focusPh(i))
    p.addEventListener('blur', () => focusPh(null))
    p.addEventListener('click', () => {
      const keys = (p.dataset.keys || '').split(' ').filter(Boolean)
      if (!keys.length) return
      setTimeout(() => keys.forEach(k => {
        const card = document.querySelector(`.pkg[data-k="${k}"]`)
        if (!card) return
        card.classList.remove('flash')
        void card.offsetWidth
        card.classList.add('flash')
      }), 450)
    })
  })

  ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(draw)

  let rzT
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(draw, 150) })
}
