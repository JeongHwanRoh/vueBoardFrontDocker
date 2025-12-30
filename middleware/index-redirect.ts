import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

 export default defineNuxtRouteMiddleware(() => {
     return navigateTo('/login')    
  
})
