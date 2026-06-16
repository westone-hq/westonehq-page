import { initHeader, initMobileMenu, initAIWidget, initScrollReveal } from './shared.js'

const CHIPS = ['우리 업무도 자동화가 되나요?', '쇼핑몰 구축 비용과 기간은?', '검수와 하자보수는 어떻게 되나요?']

export function initProductPage() {
  initHeader()
  initMobileMenu()
  // ===== WESTONE AI 위젯: 다음 업데이트 시 활성화 예정. 아래 블록 주석 해제하면 부활 =====
  /*
  initAIWidget({
    chips: CHIPS,
    mockResponses: {
      '우리 업무도 자동화가 되나요?': '자동화 가능 여부는 샘플 파일을 보내주시면 검토 후 안내드립니다. 엑셀 취합, 반복 문자 발송, 웹 데이터 수집 등 규칙이 있는 업무는 대부분 리포트원으로 자동화할 수 있습니다.',
      '쇼핑몰 구축 비용과 기간은?': '서비스원 스토어는 웹/모바일 반응형 쇼핑몰 기준으로 220만원부터 시작하며, 구축 기간은 보통 2~6주 소요됩니다. 결제 연동과 기본 관리자 기능이 포함됩니다.',
      '검수와 하자보수는 어떻게 되나요?': '납품 전 샘플 기준으로 7영업일 간 검수를 진행합니다. 납품 후 90일 동안 무상 하자보수를 기본 제공하며, 이후에도 케어원 서비스로 안정적인 튜닝과 유지보수가 가능합니다.',
    },
    defaultResponse: '정확한 내용 파악을 위해 자세한 상담이 필요할 수 있습니다. 아래 문의 폼을 이용해 샘플 파일이나 내용을 남겨주시면 확인 후 연락드리겠습니다.',
  })
  */
  initScrollReveal('.r-hero-inner, .r-pricing, .r-block, .r-faq, .r-cta-band')
}
