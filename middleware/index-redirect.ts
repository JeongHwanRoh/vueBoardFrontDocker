import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

 export default defineNuxtRouteMiddleware(() => {

  
  const isLogin = useCookie('isLogin')


  if (!isLogin.value) {
     return navigateTo('/login')    
  }

  return navigateTo('/board')
})
