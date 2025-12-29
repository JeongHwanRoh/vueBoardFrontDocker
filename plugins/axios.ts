import axios from 'axios'

// axios 플러그인 설정 -> /api가 프록시를 통해 백엔드로 연결됨.
export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: '/api',
    withCredentials: true
  })
  return {
    provide: {
      api
    }
  }
})
