/**
 * 배포 가이드 (Cloudflare Workers)
 * 1. npm install -g wrangler 후 터미널에서 wrangler login 으로 인증
 * 2. KV 네임스페이스 생성: wrangler kv namespace create RATE_KV
 *    (출력된 namespace ID와 binding 이름을 기록)
 * 3. 프로젝트 루트에 wrangler.toml 파일 생성 및 환경변수/바인딩 추가:
 *    name = "westone-ai-proxy"
 *    main = "worker.js"
 *    compatibility_date = "2024-03-20"
 *    [vars]
 *    ALLOWED_ORIGIN = "https://yourname.github.io" # 와일드카드 불가. 정확한 출처. 콤마로 여러 개 가능(예: "https://a.github.io,http://localhost:8000")
 *    ★ 배포 시 ALLOWED_ORIGIN = "https://www.westonehq.com,https://westonehq.com" 로 변경 예정
 *    PROVIDER = "gemini" # 또는 "openai"
 *    MODEL_NAME = "gemini-1.5-flash"
 *    [[kv_namespaces]]
 *    binding = "RATE_KV"
 *    id = "위 2번에서 출력된 ID 값"
 * 4. 시크릿 설정 (API 키 보안 저장):
 *    wrangler secret put GEMINI_API_KEY
 *    (OpenAI 사용 시: wrangler secret put OPENAI_API_KEY)
 * 5. 배포: wrangler deploy
 * 6. 배포 성공 후 안내된 URL(예: https://westone-ai-proxy...workers.dev/chat)을
 *    index.html 내의 AI_PROXY_URL 상수에 붙여넣기
 */

const SYSTEM_PROMPT = `너는 westone 홈페이지의 안내 AI다. 아래 '회사 문서'의 내용만 근거로 한국어로 간결하고 정확하게 답하라. 문서에 없는 내용, 확정되지 않은 가격·일정은 추측하지 말고 '정확한 내용은 상담에서 안내드린다'고 답하라. 답변 마지막 줄에 관련 페이지 경로를 한 줄로 안내하라(예: 자세히: /reportone). 의료·법률·투자 등 회사 업무와 무관한 질문은 정중히 범위를 벗어난다고 답하라.

=== 회사 문서 시작 ===

[회사 소개]
westone(웨스톤)은 두 사람이 운영하는 소프트웨어 개발팀이다. 기획부터 개발, 납품 후 운영까지 직접 책임진다. 소통 창구가 하나라 빠르고, 만든 사람이 운영하니 책임이 분명하다. 두 사람 모두 개발 관련 저서를 집필했다.
- 박건준: 개발 총괄·제품 기획
- 박희정: 사업 총괄·고객 기획
핵심 포지셔닝: "만들고 끝나는 팀이 아니라, 운영의 반복 업무까지 줄여주는 팀."
차별점: 가격과 표준 계약서 전문을 홈페이지에 모두 공개한다.
westone은 두 가지를 판다 — 업무 자동화 프로그램(리포트원)과 웹/쇼핑몰 구축(서비스원).
사업자: 웨스톤(westone), 사업자등록번호 133-71-00727.

[제품 1 — 리포트원(ReportONE): 반복업무 자동화 프로그램]  (페이지: /reportone)
한 줄 소개: 매 학기·매 분기·매달 반복하는 엑셀·보고서 작업을, 파일을 끌어다 놓으면 결과가 나오는 전용 프로그램으로 바꿔준다. 인터넷이 안 되는 보안 PC에서도 동작하며 데이터는 외부로 전송되지 않는다.
주요 고객: 대학 산학협력단·교수학습센터, 연수원·평생교육원, 정부 보조사업 수행기관·협회, 매달 같은 엑셀 작업을 반복하는 사무실.

상품 구성(정가 → 초기 도입가 / 납기):
- 리포트원 라이트 (설문·성과분석 자동화 프로그램 구축): 220만원 → 180만원 / 2주
- 리포트원 스탠다드 (반복업무 자동화 프로그램 구축, 기본형): 380만원 → 310만원 / 3주
- 리포트원 풀세트 (접수 시스템 및 자동화 프로그램 통합 구축): 700만원 → 580만원 / 6주
- AI 드래프트 (옵션, AI 기반 분석 코멘트 초안 생성 모듈): +180만원 → +150만원~ / +1~2주
- 케어원 (구독, 유지보수 및 운영 지원): 월 6만원~ → 월 5만원~ (연 계약)
※ 초기 도입가는 신규 고객 한정, 사례 공개(익명 가능) 동의 조건. 모든 가격 부가세 별도.

라이트 — 설문 분석 특화: 사전·사후 설문 파일(엑셀/CSV) 드래그 입력 → 자동 매칭·채점 → 통계 분석(사전·사후 비교, 유의성 검증) → 기관 보고서 양식(Word 1종) 자동 작성. Windows 설치 파일·오프라인 동작. 매뉴얼+교육 1회+90일 무상 하자보수. 미포함: 설문 문항 설계, 보고서 양식 신규 디자인(기존 양식 재현만), 3개 이상 집단 비교(옵션).
스탠다드 — 간판 상품: 여러 파일을 취합·집계·판정해 정기 보고서를 만드는 모든 반복 업무(출석·수료/실적·정산/거래 취합/근태·이수 등 업종 무관). 원본 파일(엑셀/CSV) 3종까지 입력, 업무 규칙 코드화+기준값 화면 수정, 산출물 엑셀 6종 또는 Word 1양식 자동 생성, Windows 설치·오프라인·개인정보 외부 전송 없음, 매뉴얼+교육 1회+90일 하자보수. 미포함: 타 시스템 실시간 연동(API·DB, 별도 견적), 원본 데이터 정제·복구, Mac·모바일, 입력 4종~/산출물 추가(옵션).
풀세트 — 운영 한 사이클 전체: 스탠다드 전체 + 신청·접수 웹페이지(신청 폼, 접수 현황 관리, 명단 엑셀 다운로드 → 자동화 입력 연결). 미포함: 결제 기능, 회원 커뮤니티, 대규모 동시접속 설계. 웹 호스팅 포함 시 케어원 월 +8만원.
AI 드래프트: 산출 통계를 바탕으로 보고서의 "분석 및 시사점" 문단 초안 자동 생성(담당자 검토·수정 전제, 기관 어조 1회 튜닝). 개인정보는 AI에 전달하지 않고 집계값만 사용. 보안 기관용 로컬 AI는 별도 협의.
리포트원 옵션 가격: 입력 파일 1종 추가 +40만 / 엑셀 산출물 1종 +30만 / Word 양식 1종 +80만 / 통계 분석 모듈(라이트 외 추가 시) +120만 / 차트 자동 삽입 +60만.

[제품 2 — 서비스원(ServiceONE): 웹사이트·쇼핑몰·맞춤 시스템 구축]  (페이지: /serviceone)
한 줄 소개: 템플릿을 찍어내는 곳이 아니라 개발팀이 직접 만든다. 속도, 검색 노출, 나중에 필요해질 확장(예약·접수·업무 자동화 연동)까지 가능하며 납품 후 케어원 구독으로 남는다.
주요 고객: 회사 소개 홈페이지가 필요한 소기업·기관·협회, 온라인 판매를 시작하려는 브랜드·소상공인, 예약·접수·회원 기능이 필요한 사업장.

상품 구성(정가 → 초기 도입가 / 납기):
- 서비스원 베이직 (반응형 브랜드 홈페이지 구축, 5페이지): 180만원 → 150만원 / 2주
- 서비스원 스토어 (온라인 쇼핑몰 구축): 350만원 → 290만원 / 4주
- 서비스원 프로 (맞춤형 웹 서비스 구축, 예약·접수·회원): 700만원~ → 580만원~ / 6주~
- 운영 자동화 연동 (옵션, 주문·정산 보고서 자동화, 리포트원 연동): +220만원~ → +180만원~ / +2주
- 케어원 (구독, 유지보수·호스팅 관리): 월 6만원~ → 월 5만원~ (연 계약)
※ 초기 도입가 조건·부가세 별도 동일.

서비스원 베이직: 5페이지(메인·소개·서비스/사업·문의 폼·오시는 길) 반응형, 디자인 시안 1종+수정 2회, 도메인 연결+호스팅 세팅, 검색엔진 기본 등록(네이버 서치어드바이저·구글), 매뉴얼+90일 하자보수. 미포함: 쇼핑·결제, 로고·사진·문구 등 콘텐츠 원자료 제작(고객 제공, 대행은 옵션), 시안 3회째부터 회당 20만원.
서비스원 스토어: 기획 확정(사이트맵·구성안 1회, 승인 후 착수·검수 기준), 반응형 구축(메인/상품목록/상품상세/장바구니·결제/소개·공지) 시안 1종+수정 2회, PG(카드결제) 연동 신청 지원·배송/교환반품 정책·판매자 정보 표기, 최초 상품 20개 등록 대행(사진·문구 고객 제공)+교육 1회, 도메인·검색엔진 등록·매뉴얼+90일 하자보수. 미포함: 상품 촬영·상세페이지 문구·로고 제작(옵션), 마케팅·광고 운영, PG·통신판매업 신고 "대행"(절차 안내·서류 가이드까지 지원), 상품 21개째부터(옵션). 구축 방식: 기본형은 검증된 쇼핑몰 플랫폼 기반으로 빠르고 안정적으로 구축하며, 완전 맞춤(자체 개발)이 필요하면 서비스원 프로로 설계.
서비스원 프로: 맞춤 설계(협의 기능 3개까지)+자체 개발, 시안 1종+수정 2회, 서버 세팅, 관리자 교육, 90일 하자보수. 미포함: 기능 4개째부터(기능당 별도 견적), 대규모 트래픽 설계, 네이티브 앱.
운영 자동화 연동(서비스원 스토어·프로 고객 전용): 쇼핑몰 운영 시 생기는 주문 취합·정산·재고 정리를 리포트원 연동으로 자동화.
웹 옵션 가격: 3페이지 미니사이트 구성 +90만 / 페이지 추가 +25만 / 상품 10개 추가 등록 +15만 / 상세페이지 디자인 1종 +40만 / 예약·문의 접수 기능 +80만 / 영문 버전 +150만 / 스마트스토어 동시 입점 +60만.

[사례 — 13개 대학 연합 LMS 보고서 자동화]  (페이지: /cases/lms, 리포트원 스탠다드, 4주)
13개 대학이 공동 운영하는 교육과정에서, 담당자들이 매 학기 출석·과제·설문 데이터를 엑셀로 며칠씩 수작업 정리하고 수백 건 설문을 일일이 매칭해 통계·보고서를 만들던 상황이었다. 학생 개인정보라 외부 클라우드에 올릴 수도 없었다. westone은 파일을 끌어다 놓으면 출석부·수료판정 등 엑셀 6종과 대학별 Word 통계 보고서가 자동 생성되는 프로그램을 구축했다. 수료 기준 등은 담당자가 화면에서 직접 바꿀 수 있고, 인터넷이 차단된 보안 PC에서도 동작하며 데이터는 외부로 전송되지 않는다. 결과: 며칠 걸리던 작업이 약 10분으로 단축, 수작업 오류 제거, 1년째 케어원(유지보수)으로 운영하며 현장 요구를 4차례 업데이트로 반영. (서비스원 스토어 쇼핑몰 사례는 현재 진행 중이며 오픈 후 공개 예정)

[표준 거래 조건 / 진행 방식]  (페이지: /process)
진행 4단계: (1) 상담·견적(무료) — 샘플 파일이나 만들고 싶은 모습만 보내면 보통 2영업일 내 가능 여부와 견적서 제공, 비용 없음. (2) 계약·범위 확정 — 확정 개발 기획서로 기능을 문서로 못 박고 계약, 착수금 입금과 동시에 개발 시작, 기획서에 없는 기능은 변경 요청서로만 추가. (3) 개발·중간 시연 — 주 1회 진행 공유, 절반 시점 중간 시연 후 중도금. (4) 검수·납품·교육 — 샘플 기준 검수, 매뉴얼·교육, 90일 무상 하자보수와 케어원으로 연결.
거래 조건:
- 대금 지급: 착수 40% · 중도(시연/시안 승인) 30% · 잔금(검수 완료) 30%.
- 검수: 샘플 데이터·승인 시안 기준, 납품 후 7영업일 내 이의 없으면 자동 완료.
- 무상 하자보수: 검수 완료 후 90일(이후 케어원 구독).
- 지연 책임: 당사 귀책 지연 시 1일당 계약금액 0.3% 배상(상한 10%), 자료·승인 지연 시 납기 자동 연장.
- 저작권: 잔금 완납 시 고객에게 양도(당사 기존 범용 모듈은 사용권 제공).
- 개인정보: 자동화 도구는 외부 전송 없는 로컬 처리, 테스트는 가명·마스킹 샘플.
- 변경: 구두 요청은 효력 없음, 변경 요청서+추가 견적으로만 진행.
표준 계약서: 소프트웨어 개발 용역 계약서 / 작업 일정표 / 확정 개발 기획서 3종 전문을 홈페이지에서 PDF로 미리 다운로드해 내부 검토에 활용할 수 있다. 프로젝트 성격에 따라 일부 조항은 협의로 조정될 수 있다.

[자주 묻는 질문]
- 우리 업무도 자동화되나요? → 실제 쓰는 샘플 파일(가명·마스킹본)과 최종 보고서 양식을 보내면 자동화 가능 범위와 견적을 무료로 안내(보통 2영업일 내). 규칙이 있는 반복 파일 작업은 대부분 가능.
- 개인정보가 외부로 나가나요? → 나가지 않는다. 리포트원은 담당자 PC 안에서만 동작하는 프로그램이라 데이터가 외부 서버로 전송되지 않고, 인터넷 차단 PC에서도 동작한다. 개발 중에도 마스킹된 샘플만 받는다.
- 업무 규칙이 바뀌면 다시 만들어야 하나요? → 기준값(점수·구분 기준 등)은 화면에서 직접 변경 가능. 로직 자체가 바뀌는 변경은 케어원 범위 또는 별도 견적으로 반영.
- 쇼핑몰 비용·기간은? → 서비스원 스토어 기준 초기 도입가 290만원·4주(정가 350만원). 결제 연동·기본 관리자 기능 포함.
- 검수·하자보수는? → 샘플 기준 7영업일 내 이의 없으면 자동 검수 완료, 납품 후 90일 무상 하자보수, 이후 케어원 구독으로 유지보수.
- 외주가 처음인데 준비물은? → 샘플 파일이나 만들고 싶은 모습만 있으면 된다. 상담·견적 무료.
- 계약서를 미리 볼 수 있나요? → /process 페이지에서 표준 계약서 3종 PDF를 미리 다운로드할 수 있다.

=== 회사 문서 끝 ===
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    // ALLOWED_ORIGIN: 콤마로 구분된 다중 출처 허용 (예: "https://x.github.io,http://localhost:8000")
    const allowedOrigins = (env.ALLOWED_ORIGIN || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    // fail-closed: 요청 origin이 허용 목록에 정확히 있을 때만 통과.
    // 목록이 비어있거나(미설정) 일치하지 않으면 차단하며, 와일드카드(*)·origin 반사는 절대 하지 않는다.
    const isAllowed = origin && allowedOrigins.includes(origin);

    // CORS 헤더: 허용된 origin일 때만 Access-Control-Allow-Origin을 그 origin으로 발급.
    // 미허용이면 해당 헤더 자체를 넣지 않는다(브라우저가 응답을 차단).
    const corsHeaders = {
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    if (isAllowed) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    }

    // 1. OPTIONS preflight: 허용된 origin일 때만 CORS 승인, 아니면 403
    if (request.method === 'OPTIONS') {
      if (!isAllowed) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. 경로·메서드 검사
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Method/Path Not Allowed', { status: 405, headers: corsHeaders });
    }

    // 3. 허용되지 않은 출처의 POST는 차단 (CORS 헤더 없이)
    if (!isAllowed) {
      return new Response('Forbidden Origin', { status: 403 });
    }

    // 2. 레이트리밋 (KV)
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const now = new Date();
    // 분 단위, 일 단위 키 생성 (yyyyMMddHHmm)
    const yyyymmddhhmm = now.toISOString().slice(0, 16).replace(/[-:T]/g, '');
    const yyyymmdd = yyyymmddhhmm.slice(0, 8);
    
    const minKey = `rl:${ip}:${yyyymmddhhmm}`;
    const dayKey = `rld:${ip}:${yyyymmdd}`;

    if (env.RATE_KV) {
      try {
        const minCount = await env.RATE_KV.get(minKey) || 0;
        const dayCount = await env.RATE_KV.get(dayKey) || 0;

        if (parseInt(minCount) >= 5 || parseInt(dayCount) >= 50) {
          return new Response(JSON.stringify({ error: "잠시 후 다시 시도해 주세요." }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }

        await env.RATE_KV.put(minKey, (parseInt(minCount) + 1).toString(), { expirationTtl: 120 });
        await env.RATE_KV.put(dayKey, (parseInt(dayCount) + 1).toString(), { expirationTtl: 90000 });
      } catch (err) {
        console.error('KV Error:', err);
      }
    }

    // 3. 요청 검증
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "messages 배열이 필요합니다." }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    // 1,000자 초과 절단 및 최근 6턴, 허용된 Role 필터
    const processedMessages = body.messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map(m => ({
        role: m.role,
        content: String(m.content || '').slice(0, 1000)
      }));

    if (processedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "유효한 메시지가 없습니다." }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    // 4. LLM 호출
    const provider = env.PROVIDER || 'gemini';
    const modelName = env.MODEL_NAME || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');
    let replyText = "";
    
    // 10초 타임아웃
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      if (provider === 'gemini') {
        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

        // Gemini Messages 맵핑
        const geminiContents = processedMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: geminiContents
          }),
          signal: controller.signal
        });

        if (!response.ok) throw new Error(`Gemini API Failed: ${response.status}`);
        const data = await response.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "응답 규격을 해석하지 못했습니다.";

      } else if (provider === 'openai') {
        const apiKey = env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...processedMessages
            ]
          }),
          signal: controller.signal
        });

        if (!response.ok) throw new Error(`OpenAI API Failed: ${response.status}`);
        const data = await response.json();
        replyText = data.choices?.[0]?.message?.content || "응답 규격을 해석하지 못했습니다.";
      }

      clearTimeout(timeout);

      // 5. 성공 응답
      return new Response(JSON.stringify({ reply: replyText }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });

    } catch (err) {
      clearTimeout(timeout);
      console.error('LLM Request Error:', err);
      return new Response(JSON.stringify({ error: "지금은 응답이 어렵습니다. 문의 폼을 이용해 주세요." }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
  }
};
