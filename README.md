# 업무 정리 도우미 🗂️

Vue.js와 Firebase를 활용한 AI 기반 업무 정리 웹 애플리케이션입니다.

## ✨ 주요 기능

### 📝 질문/답변 관리
- 팝업 형태의 직관적인 질문/답변 입력 인터페이스
- AI 자동 요약 및 카테고리 제안 기능
- 태그 기반 분류 시스템

### 🗂️ 스마트 카테고리 시스템
- 드래그 앤 드롭으로 쉬운 카테고리 배치
- AI 제안 카테고리 자동 생성
- 색상별 카테고리 구분

### 🔍 강력한 검색 기능
- 실시간 검색으로 빠른 정보 찾기
- 질문, 답변, AI 요약 전체 검색 지원

### 🎨 패들릿 스타일 UI
- shadcn/ui 기반의 모던한 디자인
- 반응형 레이아웃으로 모든 기기 지원
- 부드러운 애니메이션과 트랜지션

## 🚀 시작하기

### 필요 조건
- Node.js 16 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   \`\`\`bash
   npm install
   \`\`\`

2. **환경 변수 설정 (선택사항)**
   \`\`\`bash
   # .env 파일 생성
   touch .env
   \`\`\`
   
   실제 AI 기능을 사용하려면 Google Gemini API 키를 설정하세요:
   \`\`\`
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   \`\`\`
   
   **🆓 무료 Gemini API 키 발급:**
   1. https://aistudio.google.com 접속
   2. Google 계정으로 로그인
   3. "Get API Key" 클릭
   4. 무료 할당량: 일 1,500 requests, 분당 15 requests

3. **개발 서버 실행**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **브라우저에서 확인**
   http://localhost:5173 에서 애플리케이션을 확인할 수 있습니다.

## 🏗️ 프로젝트 구조

\`\`\`
src/
├── components/          # 재사용 가능한 Vue 컴포넌트
│   ├── QAModal.vue     # 질문/답변 입력 모달
│   └── CategoryModal.vue # 카테고리 생성 모달
├── views/              # 페이지 컴포넌트
│   └── Home.vue        # 메인 홈 페이지
├── services/           # 비즈니스 로직
│   └── aiService.js    # AI 요약 서비스
├── router/             # Vue Router 설정
└── firebase.js         # Firebase 설정
\`\`\`

## 🔧 기술 스택

- **Frontend**: Vue 3 + Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui 디자인 시스템
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Gemini 1.5 Flash API (무료 할당량 제공)
- **UI/UX**: 패들릿 스타일의 드래그 앤 드롭 인터페이스

## 📱 주요 화면

### 메인 대시보드
- 대기 중인 질문/답변 목록
- 카테고리별 정리된 콘텐츠
- 실시간 검색 및 필터링

### 질문/답변 입력
- 직관적인 폼 인터페이스
- AI 자동 정리 옵션
- 태그 및 카테고리 제안

### 카테고리 관리
- 색상별 카테고리 생성
- 드래그 앤 드롭으로 콘텐츠 이동
- AI 제안 카테고리 자동 생성

## 🤖 AI 기능

### 자동 요약
- 질문과 답변을 분석하여 핵심 내용 요약
- 2-3문장으로 간결한 요약 제공

### 카테고리 제안
- 내용 분석을 통한 적절한 카테고리 제안
- 기존 카테고리와의 중복 확인

### 태그 생성
- 관련 키워드 자동 추출
- 검색 및 분류에 활용

## 🔮 향후 계획

- [ ] Firebase 실시간 동기화
- [ ] 사용자 인증 시스템
- [ ] 팀 협업 기능
- [ ] 데이터 내보내기/가져오기
- [ ] 모바일 앱 개발
- [ ] 고급 AI 분석 기능

## 📄 라이선스

MIT License

## 🤝 기여하기

Pull Request를 환영합니다! 큰 변경사항의 경우 먼저 이슈를 생성해 주세요.

---

**Made with ❤️ using Vue.js & Firebase**
