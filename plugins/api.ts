import { initApi } from "~/lib/apiService/axiosApi";


export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  initApi(config.public.apiBase);
});