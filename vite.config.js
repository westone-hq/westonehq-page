import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const pageData = {
  '/index.html': {
    title: 'westone — 비즈니스를 돕는 자동화와 웹',
    description: '업무 자동화와 웹 서비스. 단순한 개발을 넘어, 비즈니스 운영의 반복 업무까지 덜어드리는 2인 개발팀 westone입니다.',
    ogTitle: 'westone — 비즈니스를 돕는 자동화와 웹 서비스',
    ogUrl: 'https://www.westonehq.com/',
    isIndex: true,
    basePath: './',
  },
  '/reportone.html': {
    title: '리포트원 — 반복업무 자동화 | westone',
    description: '원클릭으로 엑셀, PDF, 웹 데이터 취합과 문서 생성을 처리합니다.',
    ogTitle: '리포트원 — 반복업무 자동화 | westone',
    ogUrl: 'https://www.westonehq.com/reportone.html',
    isIndex: false,
    basePath: './',
  },
  '/serviceone.html': {
    title: '서비스원 — 웹사이트·쇼핑몰·맞춤 시스템 구축 | westone',
    description: '홈페이지와 쇼핑몰부터 매장 주문 시스템 같은 맞춤 솔루션까지. 전문 개발팀이 처음부터 직접 만듭니다.',
    ogTitle: '서비스원 — 웹사이트·쇼핑몰·맞춤 시스템 구축 | westone',
    ogUrl: 'https://www.westonehq.com/serviceone.html',
    isIndex: false,
    basePath: './',
  },
  '/process.html': {
    title: 'westone — 진행 방식 안내',
    description: '외주가 처음이어도 불안하지 않도록, 진행 과정과 표준 계약서를 모두 공개합니다.',
    ogTitle: '진행 방식과 표준 계약서 공개 | westone',
    ogUrl: 'https://www.westonehq.com/process.html',
    isIndex: false,
    basePath: './',
  },
  '/cases/lms.html': {
    title: '케이스 — 13개 대학 LMS 보고서 자동화 | westone',
    description: '13개 대학이 함께 운영하는 교육과정의 성적·설문 보고서 자동화. 인터넷 없는 PC에서 동작하고 1년째 운영 중입니다.',
    ogTitle: '케이스 — 13개 대학 LMS 보고서 자동화 | westone',
    ogUrl: 'https://www.westonehq.com/cases/lms.html',
    isIndex: false,
    basePath: '../',
  },
  '/cases/kiosk.html': {
    title: '케이스 — 동네 분식점 매장 주문 시스템 | westone',
    description: '소규모 분식점에서 도입한 멀티플랫폼 매장 주문 시스템. 손님 셀프 주문부터 주방 상태관리·매출 이력까지, 인터넷 없이 동작합니다.',
    ogTitle: '케이스 — 동네 분식점 매장 주문 시스템 | westone',
    ogUrl: 'https://www.westonehq.com/cases/kiosk.html',
    isIndex: false,
    basePath: '../',
  },
}

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
      context(pagePath) {
        return pageData[pagePath] ?? {}
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        index:     resolve(__dirname, 'index.html'),
        reportone: resolve(__dirname, 'reportone.html'),
        serviceone: resolve(__dirname, 'serviceone.html'),
        process:   resolve(__dirname, 'process.html'),
        cases_lms:    resolve(__dirname, 'cases/lms.html'),
        cases_kiosk: resolve(__dirname, 'cases/kiosk.html'),
      },
    },
  },
})
