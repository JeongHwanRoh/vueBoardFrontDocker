<template>

  <!--  Body Wrapper -->
  <div class="page-container" :class="{ 'sidebar-open': sidebarOpen }">
    <!--  헤더 -->
    <AppHeader @toggleSidebar="toggleSidebar" />
    <!-- 모바일 오버레이 (사이드바 열릴 때 배경 딤처리) -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>
    <!--  Main wrapper -->
    <div class="main-container">
      <!-- 사이드바 -->
      <AppSidebar @close="sidebarOpen = false" />
      <main>
        <slot />
      </main>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '../components/organisms/header/AppHeader.vue';
import AppSidebar from '../components/organisms/sidebar/AppSidebar.vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

main {
  flex: 1;
  min-width: 0;        /* flex item이 내용 크기 이하로 수축 가능하게 함 */
  padding: 1rem;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;  /* 줌인 시 가로 넘침 방지 */
}
</style>