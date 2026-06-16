import { initHeader, initMobileMenu, initAIWidget, initScrollReveal } from './shared.js'

initHeader()
initMobileMenu()

// ===== WESTONE AI 위젯: 다음 업데이트 시 활성화 예정. 아래 블록 주석 해제하면 부활 =====
/*
initAIWidget({
  chips: ['우리 업무도 이렇게 될까요?', '비용과 기간은 어떻게 되나요?', '샘플 파일을 보내려면?'],
  mockResponses: {
    '우리 업무도 이렇게 될까요?':
      '실제 쓰시는 샘플 파일(가명·마스킹본)과 원하시는 결과물 형태를 보내주시면 자동화 가능 범위를 무료로 확인해 드립니다. 통상 2영업일 이내 답변드립니다.',
    '비용과 기간은 어떻게 되나요?':
      '유사한 업무 구조가 이미 검증돼 있어, 리포트원 스탠다드 기준 1개월 내외로 구축됩니다. 정확한 범위와 비용은 샘플 파일 검토 후 견적서로 안내드립니다.',
    '샘플 파일을 보내려면?':
      '하단 문의 폼에 샘플 파일(개인정보 가명·마스킹 처리본)과 원하시는 결과물 형태를 남겨주세요. 파일 첨부도 가능합니다.',
  },
  defaultResponse:
    '정확한 파악을 위해 자세한 상담이 필요할 수 있습니다. 하단 문의 폼에 샘플 파일이나 내용을 남겨주시면 확인 후 연락드리겠습니다.',
})
*/

initScrollReveal(
  '.cs-hero-inner, .cs-summary-grid, .cs-pain-grid, .cs-constraints, .cs-transform, .cs-steps, .cs-results-grid, .cs-reuse-examples, .r-cta-band',
)
