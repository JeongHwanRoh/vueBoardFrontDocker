<template>
  <JoinForm @submit="onSubmitJoin" />
</template>

<script setup lang="ts">
import JoinForm from '@/components/organisms/login/JoinForm.vue'
import { useRouter } from 'vue-router'
import { joinApi } from '~/lib/apiService/joinApi'

const router = useRouter()

const onSubmitJoin = async (payload: {
  memberId: string
  password: string
  name: string
  email: string
}) => {
  try {
    console.log('회원가입 요청:', payload)

    const res = await joinApi.join(payload)

    // 성공 (201 Created)
    if (res.status === 201) {
      alert('회원가입이 완료되었습니다.')
      console.log('회원가입 성공:', res.data)
      router.push('/login') // 로그인 페이지 이동
    }
  } catch (error: any) {
    const status = error.response?.status

    if (status === 400) {
      alert('입력값을 다시 확인해주세요.')
    } else {
      alert('회원가입 중 오류가 발생했습니다.')
    }

    console.error('회원가입 실패:', error)
  }
}

definePageMeta({
  layout: false,
  ssr: false
})
</script>
