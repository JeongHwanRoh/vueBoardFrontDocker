import { login } from "~/lib/apiService/userApi"

export const loginHandler = () => {
    {

        const router = useRouter()
        const errorMessage = ref('')
        const loading = ref(false)

        const handleLogin = async (payload: { userId: string; password: string }) => {
            errorMessage.value = ''
            loading.value = true

            try {
                const res = await login(payload.userId, payload.password)
                if (res.success) {
                    alert('로그인 성공!')
                    router.push('/board')
                } else {
                    errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
                }
            } catch (err) {
                console.error(err)
                errorMessage.value = '서버 통신 오류가 발생했습니다.'
            } finally {
                loading.value = false
            }
        }

        return {
            errorMessage,
            loading,
            handleLogin,
        }

    }
}