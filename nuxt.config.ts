import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  routeRules: {
    // 로컬, 도커에서 모두 작동하는 프록시 설정
    // 백엔드 addResourceHandlers 에서 registry 객체가 해당 요청을 주입시켜 처리
    // 왜 http://backend:8092여야 하는가?
    // nuxt 서버가 요청을 전달하는 시점때문
    // 1) 브라우저가 사진을 달라고 localhost:3000에 요청을 보낼 경우 
    // 2) 요청을 받은 도커 내부 Nuxt 서버는 이제  접속해야 하는데
    // 3) 이때 Nuxt 컨테이너 안에서 localhost는 자기 자신이지 백엔드가 아니다.
    // 4) 따라서 도커 네트워크 이름인 http://backend(도커 컴포즈 서비스명):8092를 써야만 옆에 있는 백엔드 컨테이너로 요청이 전달된다.
    '/uploads/**': {
      proxy: `${process.env.NUXT_API_SERVER_URL || process.env.NUXT_PUBLIC_API_BASE}/uploads/**`
    }
  },
  builder: 'vite',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  ssr: false, // ssr 끄기
  runtimeConfig: {
    public: {
      // .env에 NUXT_PUBLIC_API_BASE_URL가 있으면 쓰고, 없으면 기본값 사용'
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/styles.min.css',
    '~/assets/css/paging.css',
  ],

  // nitor.devProxy ->  Vite devServer proxy 방식으로 변경(3.9 이상 version에서)
  // 실제 version: 4.1.3 
  vite: {
    server: {

      cors: false, // nuxt dev 서버가 CORS 헤더 추가하지 않도록 설정
      proxy: {
        // 로컬에서만 작동하는 이미지 요청 프록시 설정
        // addResourceHandlers 에서 registry 객체가 해당 요청을 주입시켜 처리
        // 도커에서 작동하는건 routeRules 설정에서 
        '/uploads': {
          target: process.env.NUXT_PUBLIC_API_BASE, // 백엔드 주소(base url)
          changeOrigin: true,
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
})
