import { getMe } from "~/lib/apiService/userApi"

export default defineNuxtPlugin(async () => {

  const userStore = useUserStore()
  // 이미 로그인된 경우라면 getMe 호출 안함.
  if (userStore.isLoggedIn) return

  try {
    // 헤더에 쿠키 포함
    const headers = import.meta.server
      ? useRequestHeaders(['cookie'])
      : undefined
    // getMe 호출해서 사용자 정보 가져오기
    const user = await getMe(headers)
    // pinia에 사용자 정보 설정
    userStore.setUser(user)
  } catch {
    // 사용자 정보 초기화(ex.로그아웃 시)
    userStore.clearUser()
  }
})
