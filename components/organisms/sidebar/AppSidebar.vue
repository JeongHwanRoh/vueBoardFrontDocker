<template>
  <aside class="sidebar">
    <!-- 모바일: 닫기 버튼 -->
    <button class="sidebar-close-btn" @click="emit('close')" aria-label="메뉴 닫기">✕</button>
    <div class="userZone">
      {{name}}님, 환영합니다!
    </div>
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
import { useUserStore } from '~/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();
const name=userStore.name;
// // console.log("사이드바에서 불러온 유저 이름:",name);

const emit = defineEmits(['close']);

const menu = [
  { label: '메인대시보드', path: '/dashboard' },
  { label: '게시판', path: '/board' },
  { label: '일정관리(개인)', path: '/kanban' },
  // { label: 'tiptap', path: '/tiptap' },
]

const go = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
  emit('close')
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;      /* 사이드바 너비 고정 — 줌인 시 압축되지 않음 */
  background-color: #1b2f63;
  color: white;
  padding: 1rem;

  display: flex;
  flex-direction: column;
}

.userZone {
  width: 90%;              /* sidebar 기준 90% */
  white-space: nowrap;     /* 줄바꿈 방지 */
  margin-bottom: 1rem;
  font-weight: 500;
}

/* 모바일용 닫기 버튼 (PC에서는 숨김) */
.sidebar-close-btn {
  display: none;
  align-self: flex-end;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  margin-bottom: 8px;
  line-height: 1;
}

@media (max-width: 768px) {
  .sidebar-close-btn {
    display: block;
  }
}
</style>