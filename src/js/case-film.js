// ── 케이스 상단 전체 영상 (case-film 조각) ─────────────────────────────────
// 1) 크게 시작해서 본문 너비로 줄어든다
//    영상 위쪽이 헤더 아래에 닿을 때까지는 가장 큰 크기(프레임 너비 안, 한 화면 높이 안),
//    그 뒤 스크롤 약 40svh 동안 본문 칼럼 너비로 줄고, 이후로는 본문과 함께 올라간다.
//    iframe 크기는 큰 크기로 고정하고 transform: scale() 로만 줄인다. 화면 고정(pin) 없음.
//    동작 줄이기·640px 이하: 줄어드는 동작 없이 처음부터 본문 너비.
// 2) 일시정지/재생 버튼, 화면 밖에서는 잠시 멈춤
// 3) 본문 .film-seek[data-seek] 버튼: 영상을 그 시각으로 옮기고, 화면 밖이면 영상으로 스크롤

const HEADER = 64   // 고정 헤더 높이
const GAP = 24      // 큰 크기일 때 헤더·프레임과 띄우는 거리
const SHRINK = 0.4  // 줄어드는 구간: 화면 높이의 40%

export function initCaseFilm() {
  const root = document.querySelector('[data-case-film]')
  if (!root) return
  const box = root.querySelector('.case-film-box')
  const iframe = root.querySelector('iframe')
  const btn = root.querySelector('.case-film-pp')
  const frameEl = root.closest('.frame') || document.body
  const side = document.querySelector('.side-in')
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mqNarrow = window.matchMedia('(max-width: 640px)')

  // ── 재생 상태 ──
  let userPaused = mqReduce.matches // 동작 줄이기면 멈춘 채로 시작
  let inView = true
  const send = (msg) => iframe.contentWindow?.postMessage(msg, location.origin)
  const syncPlay = () => send({ type: userPaused || !inView ? 'pause' : 'play' })
  const syncBtn = () => {
    btn.setAttribute('aria-label', userPaused ? '영상 재생' : '영상 일시정지')
    btn.classList.toggle('paused', userPaused)
  }

  const src = iframe.dataset.src + (userPaused ? '&paused=1' : '')
  iframe.addEventListener('load', () => { syncPlay() }, { once: true })
  iframe.src = src
  btn.hidden = false
  syncBtn()

  btn.addEventListener('click', () => {
    userPaused = !userPaused
    syncBtn()
    syncPlay()
  })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting === inView) return
      inView = e.isIntersecting
      syncPlay()
    }).observe(root)
  }

  // ── 본문의 "영상에서 보기" 버튼 ──
  document.querySelectorAll('.film-seek[data-seek]').forEach(b => {
    b.addEventListener('click', () => {
      send({ type: 'seek', t: +b.dataset.seek })
      const r = root.getBoundingClientRect()
      if (r.top < HEADER || r.bottom > innerHeight) {
        const top = r.top + scrollY - HEADER - GAP
        window.scrollTo({ top, behavior: mqReduce.matches ? 'auto' : 'smooth' })
      }
    })
  })

  // ── 크기 ──
  let bigW = 0, raf = 0
  const isStatic = () => mqReduce.matches || mqNarrow.matches

  const layout = () => {
    raf = 0
    const smallW = root.clientWidth
    if (isStatic()) {
      root.classList.remove('live')
      box.style.cssText = ''
      root.style.height = ''
      side?.classList.remove('under-film')
      bigW = 0
      return
    }
    root.classList.add('live')
    const fr = frameEl.getBoundingClientRect()
    const fw = frameEl.clientWidth
    const maxH = innerHeight - HEADER - GAP * 2
    const w = Math.max(smallW, Math.min(fw - GAP * 2, maxH * 16 / 9))
    if (w !== bigW) {
      bigW = w
      box.style.width = `${w}px`
      box.style.height = `${w * 9 / 16}px`
    }
    const rr = root.getBoundingClientRect()
    // 0: 가장 큼, 1: 본문 너비
    const p = Math.min(1, Math.max(0, (HEADER + GAP - rr.top) / (innerHeight * SHRINK)))
    const ease = p * p * (3 - 2 * p)
    const s = 1 - (1 - smallW / w) * ease
    // 큰 크기일 때는 프레임 가운데, 다 줄면 본문 칼럼 왼쪽에 맞춘다
    const bigLeft = fr.left + frameEl.clientLeft + (fw - w) / 2 - rr.left
    const x = bigLeft * (1 - ease)
    box.style.transform = `translate(${x}px, 0) scale(${s})`
    box.style.setProperty('--s', s)
    root.style.height = `${w * 9 / 16 * s}px`

    // 큰 영상이 왼쪽 목록 위로 겹치면 목록을 잠시 숨긴다
    if (side) {
      const sr = side.getBoundingClientRect()
      const left = rr.left + x, top = rr.top, bottom = rr.top + w * 9 / 16 * s
      const over = left < sr.right && bottom > sr.top && top < sr.bottom
      side.classList.toggle('under-film', over)
    }
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(layout) }
  addEventListener('scroll', queue, { passive: true })
  addEventListener('resize', queue)
  mqReduce.addEventListener?.('change', queue)
  mqNarrow.addEventListener?.('change', queue)
  layout()
}
