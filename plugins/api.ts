import { initApi } from "~/lib/apiService/axiosApi";

// axios 인스턴스 생성
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig(); // runtimeConfig 변수 (nuxt.config.ts 내부에 baseURL 정의되어 있음.)
  
  initApi(config.public.apiBase); // API 초기화 
});