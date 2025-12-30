<template>
  <LoginForm :error-message="errorMessage" :loading="loading" @submit="handleLogin" />
</template>

<script setup lang="ts">
import '@/assets/css/common.css'
import '@/assets/css/login.css'
import LoginForm from '@/components/organisms/login/LoginForm.vue'
import { loginHandler } from '~/lib/composables/login/loginHandler'

const {
  errorMessage,
  loading,
  handleLogin,
} = loginHandler();

definePageMeta({
  layout: false,
  ssr: false
})
</script>
