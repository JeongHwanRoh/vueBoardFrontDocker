import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { getMe } from "~/lib/apiService/userApi";

export default defineNuxtRouteMiddleware(async (to) => {
   
    // 인증 필요없는 페이지들 처리
    const publicPages = ['/login', '/join'];

    if (publicPages.includes(to.path)) {
        return; // 인증 체크 안함
    }

    console.log('Global Auth Middleware 실행 - 클라이언트 사이드');
    const userStore = useUserStore();

    // 로그인 안된 상태인 경우 -> 서버 호출 x
    if(!userStore.isLoggedIn){
        return navigateTo('/login')
    }

    //  pinia가 비어있는 경우(새로고침 시) -> 서버에 인증 여부 확인
    try {
        // 서버에 인증된 '나' 물어보기
        const user = await getMe()
        userStore.setUser(user) // Pinia에 사용자 정보 재저장
    } catch (err) {
        // Access Token 없거나 만료 시 
        // 로그인 안 된 상태로 둠
        userStore.clearUser()
        return navigateTo('/login')
    }
})
