<!-- 실제 로그인 동작 및 입력 UI 담당 컴포넌트 -->
<template>


    <div class="login-container">
      <input v-model="userId" placeholder="아이디를 입력하세요" />
      <input v-model="password" type="password" placeholder="비밀번호를 입력하세요" />
      <button @click="doLogin">로그인</button>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import {login} from "@/lib/userApi" // userApi.ts의 login 함수 불러오기

// 반응형 상태변수
const router = useRouter()
const userId = ref('')
const password = ref('')
const errorMessage = ref('')

const doLogin = async () => {
  debugger;
  try {
    const res = await login(userId.value, password.value)
    if (res.success) {
      alert('로그인 성공!')
      router.push('/board/main') // 게시판 페이지로 이동
    } else {
      errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch (error) {
    console.error('로그인 오류:', error)
    errorMessage.value = '서버 통신 오류가 발생했습니다.'
  }
}
</script>

<style scoped>

</style>
