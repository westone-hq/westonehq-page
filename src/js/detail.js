// ── 상세 페이지 (packages/*, cases/*) ──────────────────────────────────────
// 1) 사이드 목록: 지금 보는 페이지 표시, 모바일 칩 줄에서 그 칩이 보이게
// 2) 영상 구간: 화면에 들어오면 재생, 나가면 멈춤. 동작 줄이기면 정지 이미지
// 3) 이미지 크게 보기
// 4) 설계 문서 뷰어(OTIS): 메인과 같은 탭·지연 로드

import { initHeader, initMobileMenu } from './shared.js'
import { initUmlViewer } from './main-sections.js'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function initSideNav() {
  const links = [...document.querySelectorAll('.side-list a')]
  if (!links.length) return
  // 빌드 때 aria-current가 들어가지만, 없으면 주소로 맞춘다
  let current = links.find(a => a.getAttribute('aria-current') === 'page')
  if (!current) {
    const here = location.pathname.replace(/\/$/, '/index.html')
    current = links.find(a => new URL(a.href, location.href).pathname === here)
    current?.setAttribute('aria-current', 'page')
  }
  if (!current) return
  // 칩 줄(860px 이하)에서 현재 칩을 가운데쯤으로
  const strip = current.closest('.side-in')
  if (strip && strip.scrollWidth > strip.clientWidth) {
    const r = current.getBoundingClientRect(), s = strip.getBoundingClientRect()
    strip.scrollLeft += (r.left - s.left) - (s.width - r.width) / 2
  }
}

function initFilms() {
  const frames = [...document.querySelectorAll('.film-frame iframe[data-src]')]
  if (!frames.length || reduceMotion()) return // 동작 줄이기: 정지 이미지만 둔다

  const start = f => { if (f.dataset.on !== '1') { f.src = f.dataset.src; f.dataset.on = '1' } }
  const stop = f => { if (f.dataset.on === '1') { f.src = 'about:blank'; f.dataset.on = '0' } }

  if (!('IntersectionObserver' in window)) { frames.forEach(start); return }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => (e.isIntersecting ? start(e.target) : stop(e.target)))
  }, { rootMargin: '120px 0px', threshold: 0 })
  frames.forEach(f => io.observe(f))
}

function initLightbox() {
  const links = document.querySelectorAll('a.zoom')
  if (!links.length || typeof HTMLDialogElement !== 'function') return

  const dlg = document.createElement('dialog')
  dlg.className = 'lightbox'
  dlg.setAttribute('aria-label', '이미지 크게 보기')
  dlg.innerHTML = '<button type="button" class="lightbox-close" aria-label="닫기">×</button><img alt=""><p class="lightbox-cap"></p>'
  document.body.appendChild(dlg)
  const img = dlg.querySelector('img')
  const cap = dlg.querySelector('.lightbox-cap')
  let opener = null

  links.forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault()
    opener = a
    const thumb = a.querySelector('img')
    img.src = a.href
    img.alt = thumb?.alt || ''
    const text = a.closest('figure')?.querySelector('figcaption')?.textContent.trim() || ''
    cap.textContent = text
    cap.hidden = !text
    dlg.showModal()
  }))
  dlg.querySelector('.lightbox-close').addEventListener('click', () => dlg.close())
  // 이미지 밖(배경)을 누르면 닫는다
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() })
  dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus() })
}

initHeader()
initMobileMenu()
initSideNav()
initFilms()
initLightbox()
initUmlViewer()
