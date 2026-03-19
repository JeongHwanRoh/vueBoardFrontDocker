<template>
  <div class="board-header">
    <a class="header-logo">
      <img src="~/assets/images/Hwani.png" class="logo-image" alt="" />
    </a>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
});
</script>

<style scoped>
.board-header {
  background-color: #162751;
  border-bottom: 1px solid #0f1d3d;
  padding: 30px 24px;
  text-align: left;
}

.header-logo {
  display: inline-block;
  img {
    height: 40px;
  }
}
</style>
