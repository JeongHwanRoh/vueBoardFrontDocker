[260114]
1. 디자인 및 실행 구조 모두 개선
   - app.js -> default.vue(공통UI) -> index.vue
   - 기본 라우팅 및 상태관리 관련 middleware 설정
2. JWT로 로그인 시 Access Token 생성 및 cookie에 저장 (CookieUtil)
3. 새로고침 시 pinia에 인증된 user객체 정보 재저장하여 끊김이 없도록 설정함

