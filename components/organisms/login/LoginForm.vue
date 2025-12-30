<!-- 실제 로그인 동작 및 입력 UI 담당 컴포넌트 -->
<template>
  <div class="page-wrapper login-viewport radial-gradient">
    <div class="login-card">
      <a class="logo-link">
        <img src="~/assets/images/Hwani.png" class="logo-image" alt="" />
      </a>
      <input v-model="localUserId" placeholder="아이디를 입력하세요" />
      <input v-model="localPassword" type="password" placeholder="비밀번호를 입력하세요" />
      <button class="login-button btn btn-primary" :disabled="loading" @click="onSubmit">
        로그인
      </button>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  errorMessage?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { userId: string; password: string }): void
}>()


const localUserId = ref('')
const localPassword = ref('')

const onSubmit = () => {
  emit('submit', {
    userId: localUserId.value,
    password: localPassword.value
  })
}
</script>

<style scoped>
.page-wrapper {
  position: relative;
  background-color: #f6f8fa;
}

.radial-gradient {
  position: relative;
}

.radial-gradient::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0.3;
  background: radial-gradient(rgb(210, 241, 223), rgb(211, 215, 250), rgb(186, 216, 244)) 0% 0%/400% 400%;
  -webkit-animation: 15s ease 0s infinite normal none running gradient;
  animation: 15s ease 0s infinite normal none running gradient;
}

.btn {
  display: inline-block;
  padding: 9px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  border-radius: 30px;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #1b2f63;
  border-color: #1b2f63;
}

.login-viewport {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: #768b9e;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.03);
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  margin-bottom: 0;
  padding: 30px;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .login-card {
    max-width: 520px;
  }
}

@media (min-width: 992px) {
  .login-card {
    max-width: 480px;
  }
}

@media (min-width: 1400px) {
  .login-card {
    max-width: 420px;
  }
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin: 0 0 15px 0;
}

.login-button {
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  background-color: #1b2f63;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logo-link {
  display: block;
  text-align: center;
  width: 100%;
  padding: 1rem 0;
}

.logo-image {
  width: 70%;
}
</style>
