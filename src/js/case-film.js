// ── 케이스 상단 전체 영상 (case-film 조각) ─────────────────────────────────
// 1) 등장(처음 한 번): 제목과 구분선만 보이다가 약 0.6초 뒤 구분선 아래로 칸이 열리고(높이 0 → 본문 칼럼 16:9),
//    영상은 위에서 떨어지듯 들어온다. 영상은 이때 0초부터 재생, 다 열리면 아래 본문을 보인다.
//    등장 중 스크롤하면(새로고침·뒤로 가기의 스크롤 복원 포함) 바로 끝난 상태로 넘긴다.
//    intro·film-js 클래스는 조각 안의 인라인 스크립트가 첫 그림 전에 붙인다.
// 2) 아래로 스크롤하면 본문 칼럼 크기 → 헤더 아래 화면 전체(가로 전체 × 화면 - 헤더)로 커진다.
//    진행도 = 스크롤한 양 / 칸 위쪽이 헤더 아래 선에 닿기까지의 거리. 닿는 순간 딱 꽉 찬다.
//    꽉 찬 채 스크롤 약 30svh 동안 sticky 로 고정, 풀리면 꽉 찬 크기로 본문과 함께 올라간다.
//    위로 스크롤하면 그대로 거꾸로(스크롤 위치만으로 정해지는 상태라 따로 기억하지 않는다).
//    iframe 크기는 꽉 찬 영상 크기로 한 번만 정하고 transform: scale() 로만 줄인다.
//    검은 칸(.case-film-box)은 너비·높이·모서리를 함께 바꾸고, 바깥 틀 높이는 보이는 높이에 맞춘다.
//    고정 구간: 꽉 찬 뒤에만 바깥 틀 높이에 고정 거리를 더한다(그 순간 아래 본문은 화면 밖이라 보이지 않는다).
// 3) 640px 이하: 같은 순서로 열리되 화면 가로 전체 16:9, 커지기·고정 없음.
//    동작 줄이기: 등장·커지기 없이 본문 칼럼 크기, 멈춘 상태, 스틸(poster)을 덮어 둔다.
// 4) 일시정지/재생 버튼(영상 오른쪽 아래), 화면 밖에서는 잠시 멈춤.

const HEADER = 64   // 고정 헤더 높이
const PIN = 0.3     // 꽉 찬 채 고정하는 구간: 화면 높이의 30%
const RADIUS = 14   // 본문 크기일 때 모서리 (기존 카드 반경)
const OPEN_AT = 600 // 페이지에 들어온 뒤 칸이 열리기 시작하는 때(ms)

export function initCaseFilm() {
  const root = document.querySelector('[data-case-film]')
  if (!root) return
  const stick = root.querySelector('.case-film-stick')
  const box = root.querySelector('.case-film-box')
  const frame = root.querySelector('.case-film-frame')
  const iframe = root.querySelector('iframe')
  const poster = root.querySelector('.case-film-poster')
  const btn = root.querySelector('.case-film-pp')
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mqNarrow = window.matchMedia('(max-width: 640px)')

  // ── 재생 상태 ──
  let userPaused = mqReduce.matches // 동작 줄이기면 멈춘 채로 시작
  let waiting = root.classList.contains('intro') // 칸이 열리기 전: 불러만 두고 멈춤
  let inView = true
  const send = (msg) => iframe.contentWindow?.postMessage(msg, location.origin)
  const syncPlay = () => send({ type: userPaused || waiting || !inView ? 'pause' : 'play' })
  const syncBtn = () => {
    btn.setAttribute('aria-label', userPaused ? '영상 재생' : '영상 일시정지')
    btn.classList.toggle('paused', userPaused)
  }

  if (poster) poster.hidden = !userPaused // 스틸은 멈춘 채 시작할 때만
  iframe.addEventListener('load', syncPlay, { once: true })
  iframe.src = iframe.dataset.src + (userPaused || waiting ? '&paused=1' : '')
  btn.hidden = false
  syncBtn()

  btn.addEventListener('click', () => {
    userPaused = !userPaused
    if (!userPaused && poster) poster.hidden = true // 재생하면 스틸을 걷어 낸다
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

  // ── 크기 ──
  // mode: 'live'(커지기·고정) | 'wide'(640 이하, 가로 전체) | 'col'(동작 줄이기, 본문 칼럼)
  let mode = '', vw0 = 0, vh0 = 0, colW = 0, viewW = 0, bigH = 0, pin = 0, raf = 0

  const measure = () => {
    mode = mqReduce.matches ? 'col' : mqNarrow.matches ? 'wide' : 'live'
    colW = root.clientWidth
    viewW = document.documentElement.clientWidth
    bigH = innerHeight - HEADER
    pin = innerHeight * PIN
    root.classList.toggle('live', mode === 'live')
    root.classList.toggle('wide', mode === 'wide')
    // iframe 은 꽉 찬 영상 크기로 한 번만 정한다
    if (mode === 'live') vw0 = Math.min(viewW, bigH * 16 / 9)
    else vw0 = mode === 'wide' ? viewW : colW
    vh0 = vw0 * 9 / 16
    frame.style.width = `${vw0}px`
    frame.style.height = `${vh0}px`
    layout()
  }

  // 검은 칸 W×H 와 그 안의 영상(contain)을 그린다
  const draw = (W, H, r) => {
    box.style.width = `${W}px`
    box.style.height = `${H}px`
    box.style.marginLeft = `${(colW - W) / 2}px` // 본문 칼럼은 화면 가운데에 있다
    box.style.borderRadius = `${r}px`
    stick.style.height = `${H}px`
    const vw = Math.min(W, H * 16 / 9), vh = vw * 9 / 16
    const s = vw / vw0, x = (W - vw) / 2, y = (H - vh) / 2
    frame.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    btn.style.right = `${x + 14}px`
    btn.style.bottom = `${y + 14}px`
  }

  const layout = () => {
    raf = 0
    const smallH = colW * 9 / 16
    if (mode !== 'live') {
      const H = mode === 'wide' ? vh0 : smallH
      draw(mode === 'wide' ? viewW : colW, H, mode === 'wide' ? 0 : RADIUS)
      root.style.height = `${H}px`
      return
    }
    // 칸 위쪽이 헤더 아래 선에 닿기까지의 거리(맨 위 기준). 칸 위쪽 위치는 칸 높이와 상관없다
    const reach = root.getBoundingClientRect().top + scrollY - HEADER
    const g = reach > 0 ? Math.min(1, Math.max(0, scrollY / reach)) : 1
    const H = smallH + (bigH - smallH) * g
    draw(colW + (viewW - colW) * g, H, RADIUS * (1 - g))
    root.style.height = `${H + (g >= 1 ? pin : 0)}px`
  }

  const queue = () => { if (!raf) raf = requestAnimationFrame(layout) }
  addEventListener('scroll', queue, { passive: true })
  addEventListener('resize', measure)
  mqReduce.addEventListener?.('change', measure)
  mqNarrow.addEventListener?.('change', measure)
  measure()

  // ── 등장 ──
  if (!waiting) return
  const body = root.closest('.dt-body')
  let timer = 0
  const finish = () => {
    if (!waiting && !root.classList.contains('opening')) return
    clearTimeout(timer)
    removeEventListener('scroll', onScroll)
    root.classList.remove('intro', 'opening')
    body?.classList.remove('film-intro')
    if (waiting) { waiting = false; syncPlay() }
  }
  const onScroll = () => finish()
  const open = () => {
    if (mode === 'col') return finish()
    waiting = false
    syncPlay() // 0초에서 멈춰 있던 영상을 칸이 열리는 순간부터 재생
    root.classList.remove('intro')
    root.classList.add('opening')
    box.addEventListener('animationend', (e) => { if (e.target === box) finish() })
  }
  addEventListener('scroll', onScroll, { passive: true })
  if (scrollY > 0) finish() // 이미 내려와 있으면(스크롤 복원) 등장 없이
  else timer = setTimeout(open, Math.max(0, OPEN_AT - performance.now()))
}
