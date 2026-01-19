import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

export default defineNuxtRouteMiddleware(async (to) => {
    // 인증 필요없는 페이지들 처리
    const publicPages = ['/login', '/join'];

    if (publicPages.includes(to.path)) {
        return; // 인증 체크 안함
    }

    console.log('Global Auth Middleware 실행 - 클라이언트 사이드');
    const userStore = useUserStore();
    
    // 만약 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
    if (!userStore.isLoggedIn) return navigateTo('/login');

})
