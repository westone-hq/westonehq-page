import { initHeader, initMobileMenu, initAIWidget, initScrollReveal } from './shared.js'

initHeader()
initMobileMenu()

// ===== WESTONE AI 위젯: 다음 업데이트 시 활성화 예정. 아래 블록 주석 해제하면 부활 =====
/*
initAIWidget({
  chips: ['우리 업무도 자동화가 되나요?', '쇼핑몰 구축 비용과 기간은?', '검수와 하자보수는 어떻게 되나요?'],
  mockResponses: {
    '우리 업무도 자동화가 되나요?': '실제 쓰시는 샘플 파일(가명·마스킹본)과 보고서 양식을 보내주시면 자동화 가능 범위와 견적을 무료로 안내드립니다(보통 2영업일 내). 여러 엑셀·CSV 파일을 취합·집계·판정해 정기 보고서를 만드는 반복 업무라면 대부분 리포트원으로 자동화할 수 있습니다.\n자세히: /reportone',
    '쇼핑몰 구축 비용과 기간은?': '서비스원 스토어(온라인 쇼핑몰 구축)는 초기 도입가 450만원부터, 약 4주 소요됩니다(정가 550만원). 결제(PG) 연동 신청 지원, 배송·교환반품 정책, 최초 상품 20개 등록 대행이 포함됩니다.\n자세히: /serviceone',
    '검수와 하자보수는 어떻게 되나요?': '계약 시 받은 샘플 기준으로 검수하며, 납품 후 7영업일 내 이의가 없으면 자동으로 검수 완료됩니다. 검수 완료 후 90일간 무상 하자보수를 기본 제공하고, 이후에는 케어원 구독으로 유지보수를 이어갑니다.\n자세히: /process',
  },
  defaultResponse: '정확한 내용은 상담에서 안내드립니다. 아래 문의 폼에 샘플 파일이나 내용을 남겨주시면 확인 후 연락드리겠습니다.\n문의: /#contact',
})
*/

initScrollReveal('.pkg-header, .pkg-card, .case-header, .case-card, .proc-header, .proc-step, .about-team, .about-books, .contact-copy, .contact-form-wrap')

// ── Section active spy ────────────────────────────────────────────────────
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    document.querySelectorAll('.header-menu-link').forEach(l => l.setAttribute('aria-current', 'false'))
    const id = entry.target.id
    if (id) {
      const link = document.querySelector(`.header-menu-link[href*="#${id}"]`)
      link?.setAttribute('aria-current', 'true')
    }
  })
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 })

;['packages', 'cases', 'process', 'about', 'contact'].forEach(id => {
  const el = document.getElementById(id)
  if (el) activeObserver.observe(el)
})

// ── Contact form ──────────────────────────────────────────────────────────
const contactForm  = document.getElementById('contactForm')
const submitBtn    = document.querySelector('.contact-submit')
const successMsg   = document.getElementById('contactSuccessMsg')
const errorMsg     = document.getElementById('contactErrorMsg')

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT_URL ?? contactForm.getAttribute('action')
  submitBtn.textContent = '보내는 중…'
  submitBtn.disabled = true
  if (errorMsg) errorMsg.style.display = 'none'

  if (!endpoint || endpoint === 'FORM_ENDPOINT_URL') {
    setTimeout(() => {
      contactForm.style.display = 'none'
      if (successMsg) { successMsg.style.display = 'block'; successMsg.setAttribute('aria-hidden', 'false') }
    }, 800)
    return
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('Network response was not ok.')
    contactForm.style.display = 'none'
    if (successMsg) { successMsg.style.display = 'block'; successMsg.setAttribute('aria-hidden', 'false') }
  } catch {
    if (errorMsg) { errorMsg.style.display = 'block'; errorMsg.setAttribute('aria-hidden', 'false') }
    submitBtn.textContent = '상담 신청 보내기'
    submitBtn.disabled = false
  }
})
