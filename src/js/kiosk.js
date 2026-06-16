import { initHeader, initMobileMenu, initAIWidget, initScrollReveal } from './shared.js'

initHeader()
initMobileMenu()

// ===== WESTONE AI 위젯: 다음 업데이트 시 활성화 예정. 아래 블록 주석 해제하면 부활 =====
/*
initAIWidget({
  chips: ['우리 매장도 이렇게 될 수 있나요?', '기존 태블릿을 써도 되나요?', '도입 비용과 기간은?'],
  mockResponses: {
    '우리 매장도 이렇게 될 수 있나요?':
      '카페·분식점·식당 등 주문이 오가는 매장이라면 적용할 수 있습니다. 매장 규모, 메뉴 수, 현재 기기 보유 현황을 알려주시면 맞춤 구성을 안내드립니다.',
    '기존 태블릿을 써도 되나요?':
      'Android·iOS 태블릿, Windows·macOS PC, 웹 브라우저 모두 지원합니다. 기존에 쓰던 기기에 그대로 설치할 수 있어, 별도 장비 구매 없이 시작하는 경우가 많습니다.',
    '도입 비용과 기간은?':
      '매장 구성과 원하는 기능에 따라 달라집니다. 정확한 내용은 상담에서 안내드립니다. 하단 문의 폼에 매장 규모와 원하시는 기능을 남겨주세요.',
  },
  defaultResponse:
    '정확한 내용은 상담에서 안내드립니다. 하단 문의 폼에 매장 규모와 원하는 기능을 남겨주시면 확인 후 연락드리겠습니다.',
})
*/

initScrollReveal(
  '.cs-hero-inner, .cs-summary-grid, .cs-pain-grid, .cs-constraints, .cs-flow, .cs-steps, .cs-results-grid, .cs-reuse-examples, .r-cta-band',
)
