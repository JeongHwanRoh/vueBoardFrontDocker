<template>
  <header class="board-header">
    <h1 v-if="user">👋 {{ user.memberId }}님 환영합니다</h1>
    <h1 v-else>🔒 로그인이 필요합니다</h1>
  </header>
</template>

<script setup>
defineProps({
  user: Object,
});
</script>

<style scoped>
.board-header {
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 16px 24px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}
</style>
