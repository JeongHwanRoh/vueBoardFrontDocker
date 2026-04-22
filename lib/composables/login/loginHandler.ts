import { ref } from 'vue'
import { useRouter } from '#app'
import { login } from '~/lib/apiService/userApi'
import { useUserStore } from '~/stores/userStore'

export const useLoginHandler = () => {
  const router = useRouter()
  const userStore = useUserStore()

  const errorMessage = ref('')
  const loading = ref(false)

  const handleLogin = async (payload: { userId: string; password: string }) => {
    errorMessage.value = ''
    console.log('Login payload:', payload )
    try {
      const res = await login(payload.userId, payload.password)
      if (res.success) {
        userStore.setUser(res.user) // PINIA에 사용자 정보 저장 
        console.log('Login - userStore state:', userStore.$state)
        alert('로그인이 완료되었습니다.')
        router.push('/dashboard') // 로그인 성공 후 대시보드로 이동
      } else {
        errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
      }
    } catch (err) {
      console.error(err)
      errorMessage.value = '서버 통신 오류가 발생했습니다.'
    } 

  }

  return {
    errorMessage,
    loading,
    handleLogin,
  }
}
