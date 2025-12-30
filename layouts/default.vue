<template>

  <!--  Body Wrapper -->
  <div class="page-container">
    <!--  헤더 -->
    <AppHeader />
    <!--  Main wrapper -->
    <div class="main-container">
      <!-- 사이드바 -->
      <AppSidebar />
      <main>
        <slot />
      </main>
    </div>
  </div>

</template>

<script setup lang="ts">
import AppHeader from '../components/organisms/header/AppHeader.vue';
import AppSidebar from '../components/organisms/sidebar/AppSidebar.vue';

</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 전체 화면 높이 기준 */
}

.main-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

main {
  flex: 1;
  /* 남은 공간을 다 채움 */
  padding: 1rem;
  overflow: auto;
  /* 내용이 넘칠 때 스크롤 */
}
</style>