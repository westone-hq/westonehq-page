# westonehq-page

[westone](https://www.westonehq.com/) 2인 개발팀의 공식 웹사이트 소스 코드입니다.

## 🚀 프로젝트 소개

westone은 복잡한 반복 업무를 프로그램으로 자동화하고, 확장하는 비즈니스를 위해 맞춤형 웹 서비스를 구축하는 2인 개발팀입니다.
이 프로젝트는 westone의 서비스, 포트폴리오, 진행 방식 등을 소개하는 공식 웹페이지입니다.

### 주요 서비스
- **REPORTONE (업무 자동화)**: 반복되는 자료조사, 통계, 보고서 작업을 클릭 한 번에 처리할 수 있도록 도와주는 전용 프로그램 개발
- **SERVICEONE (웹 서비스)**: 홈페이지, 쇼핑몰, 예약/접수 및 매장 주문 시스템 등 비즈니스 확장을 위한 맞춤형 솔루션 구축

## 🛠 기술 스택

- **Core**: HTML5, CSS3, JavaScript (Vanilla)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Templating**: [Handlebars](https://handlebarsjs.com/) (`vite-plugin-handlebars` 활용)

## 📁 프로젝트 구조

```text
westonehq-page/
├── index.html          # 메인 페이지 (히어로, 서비스 요약, 케이스, 진행방식 등)
├── reportone.html      # 업무 자동화(REPORTONE) 소개 상세 페이지
├── serviceone.html     # 웹 서비스(SERVICEONE) 소개 상세 페이지
├── process.html        # 진행 방식 및 계약서 안내 페이지
├── cases/              # 포트폴리오 상세 페이지
│   ├── lms.html        # 사례 1: 13개 대학 LMS 보고서 자동화
│   └── kiosk.html      # 사례 2: 동네 분식점 매장 주문 시스템
├── src/
│   ├── css/            # 스타일시트 파일 (index.css 등)
│   ├── js/             # 스크립트 파일 (index.js 등)
│   └── partials/       # Handlebars 공통 컴포넌트 (header, footer, head 등)
├── public/             # 정적 에셋 (이미지 등, 필요 시)
├── vite.config.js      # Vite 빌드 및 Handlebars 플러그인 라우팅 설정
└── package.json        # 의존성 모듈 및 스크립트
```

## 💻 시작하기

### 필수 조건
- [Node.js](https://nodejs.org/) (NVM 등을 통해 설정된 버전을 권장합니다. `.nvmrc` 참고)

### 설치 및 로컬 실행

1. 저장소 클론 및 이동
```bash
git clone https://github.com/[사용자계정]/westonehq-page.git
cd westonehq-page
```

2. 패키지 설치
```bash
npm install
```

3. 로컬 개발 서버 실행
```bash
npm run dev
```
개발 서버가 시작되면 브라우저가 자동으로 열리거나 로컬 주소(예: `http://localhost:5173`)에서 페이지를 확인할 수 있습니다.

### 빌드 및 배포 준비

- 프로덕션 환경을 위한 최적화된 정적 파일 빌드
```bash
npm run build
```

- 빌드된 결과물을 로컬에서 미리보기
```bash
npm run preview
```

## 📞 문의 및 상담 (Contact)

- **웹사이트**: [https://www.westonehq.com/](https://www.westonehq.com/)
- **이메일**: [westone251113@gmail.com](mailto:westone251113@gmail.com)

---

*© westone. All rights reserved.*
