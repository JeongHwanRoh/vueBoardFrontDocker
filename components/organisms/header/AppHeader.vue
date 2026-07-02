<template>
  <div class="board-header">
    <!-- 모바일: 햄버거 버튼 -->
    <button class="hamburger-btn" @click="emit('toggleSidebar')" aria-label="메뉴 열기">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <a class="header-logo">
      <img src="~/assets/images/Hwani.png" class="logo-image" alt="" />
    </a>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
});

const emit = defineEmits(['toggleSidebar']);
</script>

<style scoped>
.board-header {
  background-color: #162751;
  border-bottom: 1px solid #0f1d3d;
  padding: 30px 24px;
  text-align: left;
  display: flex;
  align-items: center;
}

.header-logo {
  display: inline-block;
  img {
    height: 40px;
  }
}
</style>
