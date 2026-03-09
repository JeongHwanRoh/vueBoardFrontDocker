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
  padding: 1rem;
  min-height: 0;
  overflow-y: auto;
}
</style>