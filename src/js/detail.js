// ── 상세 페이지 (packages/*, cases/*) ──────────────────────────────────────
// 1) 사이드 목록: 지금 보는 페이지 표시, 모바일 칩 줄에서 그 칩이 보이게
// 2) 케이스 상단 전체 영상 (case-film.js)
// 3) 이미지 크게 보기 (lightbox.js)
// 4) 설계 문서 뷰어(OTIS): 탭·지연 로드
// 5) 진행 순서 9단계 (process-steps.js, 패키지 페이지)

import { initHeader, initMobileMenu } from './shared.js'
import { initUmlViewer } from './main-sections.js'
import { initLightbox } from './lightbox.js'
import { initProcessSteps } from './process-steps.js'
import { initCaseFilm } from './case-film.js'

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

initHeader()
initMobileMenu()
initSideNav()
initCaseFilm()
initLightbox()
initUmlViewer()
initProcessSteps()
