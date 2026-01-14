import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { getMe } from "~/lib/apiService/userApi";

export default defineNuxtRouteMiddleware(async (to) => {
   
    // 인증 필요없는 페이지들 처리
    const publicPages = ['/login', '/join'];

    if (publicPages.includes(to.path)) {
        return; // 인증 체크 안함
    }

    if (process.server) return
    const userStore = useUserStore();
    //  pinia가 비어있는 경우(새로고침 시) -> 서버에 인증 여부 확인
    try {
        // 서버에 인증된 '나' 물어보기
        const user = await getMe()
        userStore.setUser(user) // Pinia에 사용자 정보 재저장
    } catch (err) {
        // Access Token 없거나 만료 시 
        // 로그인 안 된 상태로 둠
        userStore.clearUser()

        // 로그인 페이지로 리다이렉트
        if (to.path !== '/login') {
            return navigateTo('/login')
        }
    }
})
