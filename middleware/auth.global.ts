import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"

export default defineNuxtRouteMiddleware((to) => {

    // 본 프로젝트는 클라이언트 사이드중심이더라도, 사용자가 브라우저 주소창에 주소를 직접 입력해서 접속하거나 새로고침을 누르는 순간
    // NUXT가 서버에서 첫번째 렌더링을 시도하기 때문에 미들웨어에서 무한루프 도는 문제 여전히 존재
    // 따라서 새로고침시 서버 사이드에서 리다이렉트 로직을 타지 않도록 방어로직을 세워야 한다.

    // PINIA 호출
    const userStore = useUserStore();
    // 인증 필요없는 페이지들 처리
    const publicPages = ['/login', '/join'];

    if (publicPages.includes(to.path)) {
        return; // 인증 체크 안함
    }

    // 루트 경로는 board로 리다이렉트
    if (to.path === '/') {
        return navigateTo('/board');
    }

    // console.log('Global Auth Middleware 실행 - 클라이언트 사이드');

    // pinia-plugin-persistedstate가 플러그인 단계에서 이미 localStorage 복구를 완료함
    // 따라서 여기서는 스토어 상태만 확인하면 됨
    if (!userStore.memberId) {
        return navigateTo('/login');
    }

})
