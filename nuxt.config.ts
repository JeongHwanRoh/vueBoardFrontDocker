import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  builder: 'vite',
  devtools: { enabled: true },
  css: ['~/assets/css/styles.min.css'],

  // nitor.devProxy ->  Vite devServer proxy 방식으로 변경(3.9 이상 version에서)
  // 실제 version: 4.1.3 ㅜ
  vite: {
    server: {
      cors: false, // nuxt dev 서버가 CORS 헤더 추가하지 않도록 설정
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE, // 백엔드 주소(base url)
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/ws-chat': {

          target: process.env.NUXT_PUBLIC_API_BASE, // 백엔드 주소(base url)
          changeOrigin: true,
          secure: false, // HTTP 환경에서 SSL 검사 비활성화
          ws: true, // websocket proxy 활성화
          rewrite: (path) => path,
        }
      },
    },
    resolve: {
      // 루트 디렉토리에 @ 또는 ~만 붙여도 절대 경로로 인식 -> 컴포넌트에서 루트디렉토리까지 @ 또는 ~로 간결화 가능
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)), 
        '~': fileURLToPath(new URL('./', import.meta.url)),
      },
    },

  },
  routeRules: {
    // SSR 비활성화: 서버에서 html 미리 렌더링하지 않고 클라이언트에서만 실행
    // prerendering 비활성화: 동적 스트림 기능을 가진 /ws-chat가 정상 작동 위해 정적 렌더링 비활성화
    // 웹소켓 연결 과정에서 기존 렌더링 과정과의 충돌을 방지하는 역할
    '/ws-chat/**': { ssr: false, prerender: false },
  },
})
