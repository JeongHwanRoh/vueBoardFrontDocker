<template>
  <aside class="sidebar">
    <!-- 사이드바 메뉴 -->
    <sideBarMenu :menu="menu" :active-path="route.path" @navigate="go" />
    <!-- 로그아웃 버튼 -->
    <sideBarLogout />
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from '#app'
import sideBarMenu from '~/components/molecules/sidebar/sideBarMenu.vue'
import sideBarLogout from '~/components/molecules/sidebar/sideBarLogout.vue'

const router = useRouter()
const route = useRoute()

const menu = [
  { label: '메인대시보드', path: '/dashboard' },
  { label: '게시판', path: '/board' },
  { label: '채팅', path: '/chat' },
]

const go = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #1b2f63;
  color: white;
  padding: 1rem;
}
</style>