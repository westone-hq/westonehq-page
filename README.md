# westonehq-page

[westone](https://www.westonehq.com/) 개발팀의 공식 웹사이트 소스 코드입니다.

## 프로젝트 소개

westone은 웹사이트·앱·업무 자동화·AI 에이전트를 만들고, 납품 후 사용 교육과 운영까지 함께하는 개발팀입니다.
이 사이트는 패키지(할 수 있는 일), 케이스 스터디, 출시 서비스, 진행 방식을 소개하고 상담 신청을 받습니다.

## 기술 스택

- **Core**: HTML, CSS, JavaScript (Vanilla, ES 모듈)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Templating**: [Handlebars](https://handlebarsjs.com/) (`vite-plugin-handlebars`, 페이지별 값은 `vite.config.js` 의 pageData)
- **Hosting**: Cloudflare Workers 정적 자산 (`wrangler.toml`, `dist/` 를 그대로 올린다)

## 페이지 구성

| 주소 | 내용 |
|---|---|
| `/` (`index.html`) | 메인: 히어로, 함께한 곳, 패키지 8개, 케이스 스터디 목록, 진행 방식 6단계, 출시 서비스, 팀·eBook, 자주 묻는 질문, 상담 신청 |
| `/packages/*.html` | 패키지 상세 8장: agent, automation, web, app, unity, server, education, maintenance |
| `/cases/*.html` | 케이스 스터디 5장: lms, sunstone, otis, welfare, education |
| `/process.html` | 진행 방식 안내(옛 디자인, 아직 유지) |

상세 페이지 13장은 사이드바 없이 가운데 한 칼럼(880px)이고, 맨 아래 이전·다음 링크로 오간다. 패키지 상세의 "상담 신청" 버튼은 `index.html?interest=키#contact` 로 가서 문의 폼의 관심 패키지를 미리 고른다.

## 프로젝트 구조

```text
westonehq-page/
├── index.html              # 메인
├── process.html            # 진행 방식 안내 (옛 디자인)
├── packages/               # 패키지 상세 8장
├── cases/                  # 케이스 스터디 5장
├── src/
│   ├── css/
│   │   ├── shared.css      # 디자인 값(--w-), 헤더·푸터, 진행 단계·다이어그램 틀·크게 보기 등 공통
│   │   ├── index.css       # 메인 전용
│   │   ├── detail.css      # 패키지·케이스 상세 공통
│   │   └── pages.css, process.css   # process.html 전용
│   ├── js/
│   │   ├── index.js        # 메인 진입점 (메뉴, 섹션 표시, 문의 폼)
│   │   ├── detail.js       # 상세 진입점
│   │   ├── shared.js       # 헤더·모바일 메뉴 등
│   │   ├── hero-blueprint.js, main-sections.js   # 메인 히어로 그림, 함께한 곳·케이스 목록
│   │   ├── process-steps.js  # 진행 방식 6단계 탭
│   │   ├── diagram-view.js   # 설계 문서 보기: 탭, 다이어그램 확대·이동 (메인·OTIS 공용)
│   │   ├── case-film.js      # 케이스 상단 영상 (본문 크기에서 스크롤하면 화면 전체로, 일시정지, 스틸)
│   │   └── lightbox.js       # 이미지 크게 보기
│   └── partials/           # Handlebars 조각
│       ├── head.hbs, header.hbs, footer.hbs
│       ├── process-steps.hbs           # 진행 방식 6단계 (메인·패키지 상세 공통)
│       ├── diagram-view.hbs            # 설계 문서 다이어그램 틀 (한 장 또는 탭 3개)
│       ├── case-film.hbs               # 케이스 상단 전체 영상
│       ├── cta-contact.hbs             # 상세 페이지 아래 상담 신청 띠
│       ├── side-nav-packages.hbs, side-nav-cases.hbs   # 상세 왼쪽 목록 (지금은 쓰지 않음)
│       └── ai-widget.hbs               # AI 위젯 (지금은 꺼 둠)
├── public/                 # 그대로 복사되는 정적 파일
│   ├── _redirects          # 옛 주소 → 새 주소 (301)
│   ├── films/              # 케이스 소개 영상 sunstone·otis·lms (HTML 애니메이션, ?embed=1 로 넣는다)
│   ├── images/             # 케이스 이미지(cases/), 진행 방식 자료(process/), eBook 표지 등
│   ├── ebook/              # eBook 전체본 PDF 2권
│   └── docs/               # 계약서·일정표·기획서 PDF (process.html)
├── worker.js               # AI 위젯용 Worker (위젯을 다시 켤 때 손본다)
├── wrangler.toml           # Cloudflare 배포 설정
├── vite.config.js          # 페이지 목록, 페이지별 제목·설명, Handlebars 설정
└── package.json
```

### 페이지를 더할 때

- 패키지·케이스 상세: `vite.config.js` 의 `PACKAGES` / `CASES` 배열에 한 줄을 더하고, 같은 키 이름의 HTML 을 만든 뒤 왼쪽 목록 조각에도 더한다.
- 케이스에 영상이 생기면 제목 섹션 바로 아래에 `{{> case-film src="…?embed=1" title="…" poster="…"}}` 를 넣는다.

### 영상 (`public/films/`)

`index.html?embed=1` 은 소리 없이 저절로 재생하고 끝나면 처음부터 반복한다.
같은 origin 의 부모 창에서 `postMessage` 로 `{type:'pause'}`, `{type:'play'}` 를 보낼 수 있다. `&paused=1` 이면 멈춘 채로 시작한다.

## 시작하기

### 필수 조건
- [Node.js](https://nodejs.org/) (`.nvmrc` 가 있으면 그 버전)

### 설치 및 로컬 실행

```bash
git clone https://github.com/[사용자계정]/westonehq-page.git
cd westonehq-page
npm install
npm run dev
```

개발 서버가 시작되면 브라우저가 열리거나 `http://localhost:5173` 에서 확인할 수 있다.

### 빌드

```bash
npm run build     # dist/ 에 정적 파일 생성
npm run preview   # 빌드 결과 미리보기
```

## 문의

- **웹사이트**: [https://www.westonehq.com/](https://www.westonehq.com/)
- **이메일**: [westone251113@gmail.com](mailto:westone251113@gmail.com)

---

*© westone. All rights reserved.*
