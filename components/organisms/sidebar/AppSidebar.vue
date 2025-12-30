<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li
          v-for="item in menu"
          :key="item.path"
          :class="{ active: isActive(item.path) }"
          @click="go(item.path)"
        >
          {{ item.label }}
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from '#app'

const router = useRouter()
const route = useRoute()

const menu = [
  { label: '메인대시보드', path: '/dashboard' },
  { label: '게시판', path: '/board' },
  { label: '채팅', path: '/chat' }
]

const go = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #1b2f63;
  color: white;
  padding: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 6px;
}

li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

li.active {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: bold;
}
</style>
