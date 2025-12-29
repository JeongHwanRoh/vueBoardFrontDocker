<template>
  <aside class="sidebar">
    <h3>🔍 게시글 검색</h3>

    <!-- 검색창 (BoardSearch 컴포넌트로 분리해도 OK) -->
    <BoardSearch v-model:searchKeyword="searchKeyword" :filteredBoards="filteredBoards"
      @select="$emit('select', boards.boardId)" />

    <!-- 신규 게시물 작성 모달 -->
     <!-- user 세션값이 들어올 경우에만 모달 열리게 처리 -->
    <BoardModal v-if="showModal && user" :user="user" @create="handleCreate" @close="showModal = false" />
    <ChatModal v-if="openChat && user" :user="user" :isOpen="isChatOpen" @close="closeChat"/>
    <button class="modal_btn" @click="showModal = true">신규 게시물 작성</button>
    <button class="chat_btn" @click="openChat">채팅하기</button>
    <button class="logout-btn" @click="$emit('logout')">로그아웃</button>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import BoardSearch from "@/components/board/BoardSearch.vue"; // 게시글 검색 컴포넌트
import BoardModal from "@/components/board/BoardModal.vue"; // 새 게시글 작성 모달 컴포넌트
import ChatModal from '@/components/chat/ChatModal.vue'; // 채팅 모달 컴포넌트

// BoardSidebar 컴포넌트에서 props로 상위 페이지에서 boards 객체를 가져옴
const props = defineProps({
  boards: { type: Array, default: () => [] },
  user: { type: Object, default: null },
});
const emit = defineEmits(["select", "openModal", "openChat", "logout"]); // 상위 페이지(list.vue)로 select, openModal, openChat, logout 이벤트를 전달
const searchKeyword = ref(""); // 검색어
const showModal = ref(false);   // 신규 게시물 작성 모달 상태 
const  isChatOpen=ref(false); //채팅창 오픈 여부

// 대소문자 구분 없이 검색되게 처리
const filteredBoards = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) return [];

  return props.boards.filter((b) =>
    b.title?.toLowerCase().includes(keyword)
  );
});

// 모달 내부에서 게시글 작성 완료 시 처리
const handleCreate = (newBoardData) => {
  emit("createBoard", newBoardData); //부모로 데이터 전달
  showModal.value = false; // 모달 닫기

}

// 채팅 모달 열고닫기
const openChat=()=>{
  isChatOpen.value=true;
}

const closeChat=()=>{
  isChatOpen.value=false;

}

</script>

<style scoped>
.sidebar {
  width: 250px;
  flex-shrink: 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f8f9fa;
  height: 100%;
  margin-top: 20px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.result-title {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.result-title:hover {
  color: #0056b3;
}

.no-results {
  font-size: 0.9em;
  color: #888;
}

button {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal_btn {
  background-color: #007bff;
  color: white;
}

.chat_btn {
  background-color: #28a745;
  color: white;
}

.logout-btn {
  background-color: #555;
  color: white;
}

.logout-btn:hover {
  background-color: #333;
}
</style>
