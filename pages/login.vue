<template>
  <LoginForm :error-message="errorMessage" :loading="loading" @submit="handleLogin" />
</template>

<script setup lang="ts">
import '@/assets/css/login.css'
import LoginForm from '@/components/organisms/login/LoginForm.vue'
import { useLoginHandler } from '~/lib/composables/login/loginHandler'

const {
  errorMessage,
  loading,
  handleLogin,
} = useLoginHandler();

definePageMeta({
  layout: 'auth',
  ssr: false
})
</script>
