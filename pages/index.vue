<template>
    <div class="login-view">
        <h1>로그인 페이지</h1>
        <LoginForm /> <!-- LoginForm 컴포넌트 가져오기 -->
    </div>
</template>

<script setup>
import '@/assets/css/common.css'
import '@/assets/css/login.css' // login.css import
import LoginForm from '@/components/login/LoginForm.vue'  // LoginForm 컴포넌트 가져오기
definePageMeta({
    ssr: false
})

</script>

<style scoped></style>
