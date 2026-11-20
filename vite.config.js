import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SITE = 'https://www.westonehq.com'

// 상세 페이지: [경로, 페이지 키, 제목, 설명]
const PACKAGES = [
  ['agent', 'AI 에이전트·AX 구축', '반복 업무를 AI 에이전트에게 맡기고, 사내 시스템과 안전하게 연결합니다.'],
  ['automation', '업무 자동화', '손으로 하던 문서·데이터 작업을 프로그램으로 바꿉니다.'],
  ['web', '웹사이트·웹 플랫폼', '관리자 페이지까지 갖춘 홈페이지와 필요한 기능을 만듭니다.'],
  ['app', '앱·웹앱', '스마트폰 앱과 설치 없이 쓰는 웹앱을 만듭니다.'],
  ['unity', 'Unity·인터랙티브', '보고 만지며 배우는 콘텐츠와 게임을 만듭니다.'],
  ['server', '서버·데이터', '서비스가 안정적으로 돌아가는 바탕을 만듭니다.'],
  ['education', '강의·교육', '현장에서 바로 쓰는 AI와 개발을 가르칩니다.'],
  ['maintenance', '유지보수·운영 지원', '납품 후에도 직접 운영하실 수 있게 곁에 남습니다.'],
]
const CASES = [
  ['lms', '13개 대학 보고서 자동화', '출석·과제·설문 파일을 끌어다 놓으면 엑셀 산출물과 대학별 Word 보고서가 만들어지는 프로그램입니다.'],
]

const detail = (dir, [key, name, description]) => [
  `/${dir}/${key}.html`,
  {
    title: `${name} | westone`,
    description,
    ogTitle: `${name} | westone`,
    ogUrl: `${SITE}/${dir}/${key}.html`,
    isIndex: false,
    basePath: '../',
    pageKey: key,
  },
]

const pageData = {
  '/index.html': {
    title: 'westone — 만들고, 연결하고, 가르치는 개발팀',
    description: '웹사이트·앱·업무 자동화·AI 에이전트를 만드는 IT 개발팀. 현직 개발자와 AI 강사가 상담부터 납품 후 교육까지 직접 맡습니다.',
    ogTitle: 'westone — 만들고, 연결하고, 가르치는 개발팀',
    ogUrl: `${SITE}/`,
    isIndex: true,
    basePath: './',
  },
  '/process.html': {
    title: 'westone — 진행 방식 안내',
    description: '외주가 처음이어도 불안하지 않도록, 진행 과정과 표준 계약서를 모두 공개합니다.',
    ogTitle: '진행 방식과 표준 계약서 공개 | westone',
    ogUrl: `${SITE}/process.html`,
    isIndex: false,
    basePath: './',
  },
  '/reportone.html': {
    title: '리포트원 — 반복업무 자동화 | westone',
    description: '원클릭으로 엑셀, PDF, 웹 데이터 취합과 문서 생성을 처리합니다.',
    ogTitle: '리포트원 — 반복업무 자동화 | westone',
    ogUrl: `${SITE}/reportone.html`,
    isIndex: false,
    basePath: './',
  },
  '/serviceone.html': {
    title: '서비스원 — 웹사이트·쇼핑몰·맞춤 시스템 구축 | westone',
    description: '홈페이지와 쇼핑몰부터 매장 주문 시스템 같은 맞춤 솔루션까지. 전문 개발팀이 처음부터 직접 만듭니다.',
    ogTitle: '서비스원 — 웹사이트·쇼핑몰·맞춤 시스템 구축 | westone',
    ogUrl: `${SITE}/serviceone.html`,
    isIndex: false,
    basePath: './',
  },
  '/cases/kiosk.html': {
    title: '케이스 — 동네 분식점 매장 주문 시스템 | westone',
    description: '소규모 분식점에서 도입한 멀티플랫폼 매장 주문 시스템. 손님 셀프 주문부터 주방 상태관리·매출 이력까지, 인터넷 없이 동작합니다.',
    ogTitle: '케이스 — 동네 분식점 매장 주문 시스템 | westone',
    ogUrl: `${SITE}/cases/kiosk.html`,
    isIndex: false,
    basePath: '../',
  },
  ...Object.fromEntries(PACKAGES.map(p => detail('packages', p))),
  ...Object.fromEntries(CASES.map(c => detail('cases', c))),
}

const input = {
  index: resolve(__dirname, 'index.html'),
  process: resolve(__dirname, 'process.html'),
  reportone: resolve(__dirname, 'reportone.html'),
  serviceone: resolve(__dirname, 'serviceone.html'),
  cases_kiosk: resolve(__dirname, 'cases/kiosk.html'),
}
for (const [key] of PACKAGES) input[`packages_${key}`] = resolve(__dirname, `packages/${key}.html`)
for (const [key] of CASES) input[`cases_${key}`] = resolve(__dirname, `cases/${key}.html`)

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
      context(pagePath) {
        return pageData[pagePath] ?? {}
      },
      helpers: {
        eq: (a, b) => a === b,
      },
    }),
  ],
  build: {
    rollupOptions: { input },
  },
})
