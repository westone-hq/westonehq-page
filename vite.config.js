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
  ['lms', '대학 보고서 자동화 시스템', '출석·과제·설문 파일을 끌어다 놓으면 엑셀 산출물과 종합·대학별 Word 보고서가 만들어지는 프로그램입니다.'],
  ['sunstone', 'Sunstone', '차에 있지만 잘 쓰이지 않는 기능을 필요한 순간에 먼저 권하고, 말 한마디로 켜고 끄는 차량용 앱입니다.'],
  ['otis', 'OTIS V-Check', '설치 기사의 휴대폰으로 승강기 진동과 소음을 재고, 리포트를 만들어 메일로 보내는 현장 앱입니다.'],
  ['welfare', '돌봄 일지', '돌봄 일지를 쓰고 다음 근무자에게 인수인계하는 앱입니다.'],
  ['education', '직업훈련 과정 강의', '직업훈련 과정에서 Flutter 앱 개발과 AI 활용을 강의합니다.'],
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
  ...Object.fromEntries(PACKAGES.map(p => detail('packages', p))),
  ...Object.fromEntries(CASES.map(c => detail('cases', c))),
}

const input = {
  index: resolve(__dirname, 'index.html'),
  process: resolve(__dirname, 'process.html'),
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
