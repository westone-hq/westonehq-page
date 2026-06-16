import { initHeader, initMobileMenu, initAIWidget, initScrollReveal } from './shared.js'

initHeader()
initMobileMenu()

// ===== WESTONE AI 위젯: 다음 업데이트 시 활성화 예정. 아래 블록 주석 해제하면 부활 =====
/*
initAIWidget({
  chips: ['계약서 조건을 미리 볼 수 있나요?', '착수금은 언제 내나요?', '검수 기준이 어떻게 되나요?'],
  mockResponses: {
    '계약서 조건을 미리 볼 수 있나요?': '네, 표준 계약서는 상담 시 제공해 드립니다. 기관명·금액·납기만 채우면 바로 쓸 수 있는 형식이며, 숨겨진 조항 없이 공개합니다.',
    '착수금은 언제 내나요?': '계약 체결 후 개발 착수 전에 전체 금액의 40%를 납부합니다. 중간금(30%)은 중간 시연 후, 잔금(30%)은 검수 완료 후 납부합니다.',
    '검수 기준이 어떻게 되나요?': '계약 시 제공받은 샘플 데이터 기준으로 정상 산출되면 검수 완료입니다. 납품 후 7영업일 내 이의 없으면 자동으로 검수 완료 처리됩니다.',
  },
  defaultResponse: '정확한 내용 파악을 위해 자세한 상담이 필요할 수 있습니다. 아래 문의 폼을 이용해 내용을 남겨주시면 확인 후 연락드리겠습니다.',
})
*/

initScrollReveal('.r-hero-inner, .p-tl-item, .r-pricing, .p-docs-section, .r-faq, .r-cta-band')
