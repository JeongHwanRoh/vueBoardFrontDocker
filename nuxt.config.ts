import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  builder: 'vite',
  devtools: { enabled: true },
  modules:['@pinia/nuxt'],
  runtimeConfig:{
    public:{
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

        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE, // 백엔드 주소(base url)
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
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
