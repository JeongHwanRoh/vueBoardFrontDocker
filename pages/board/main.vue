<!-- template 부분> default.vue로 빼기(유지보수 차원에서)-->
<template>
  <div class="board-layout">
    <!-- 상단 헤더 레이아웃 -->
    <BoardHeader :user="user" />

    <!--  좌측 사이드바 + 메인 -->
    <div class="board-body">
      <!-- 좌측 사이드바 레이아웃 -->
      <BoardSidebar :boards="boards" :user="user" @createBoard="doCreateBoard" @select="goToDetail"
        @openModal="showModal = true" @openChat="isChatOpen = true" @logout="doLogout" />

      <!--  메인 게시판 레이아웃-->
      <BoardMain :boards="boards" :user="user" :currentPage="currentPage" :totalPages="totalPages"
        :showModal="showModal" @create="doCreateBoard" @delete="doDeleteBoard" @changePage="changePage"
        @closeModal="showModal = false" @detail="tryGoToDetail" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { navigateTo } from "#app";

import BoardHeader from "~/components/layout/header.vue"; // 헤더 레이아웃 컴포넌트 
import BoardSidebar from "~/components/layout/sidebar.vue"; // 사이드바 레이아웃 컴포넌트
import BoardMain from "~/components/layout/main.vue"; // 메인(게시판) 레이아웃 컴포넌트
import { logout, sessionUser } from "@/lib/userApi.ts"; // userApi.ts의 logout, sessionUser 함수 불러오기
import { loadBoards, createBoard, deleteBoard } from "@/lib/boardApi.ts";

//  상태 변수
const user = ref(null);
const boards = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));
const showModal = ref(false);
const isChatOpen = ref(false);

//  게시글 목록 조회 
const doLoadBoards = async () => {
  //debugger;
  try {
    const res = await loadBoards(currentPage.value, pageSize.value); // 요청보내는 값: currentPage, pageSize
    boards.value = res.boards; // 백엔드 리턴값 (해당 페이지 게시물 목록)
    totalCount.value = res.totalCount; // 백엔드 리턴값 (총 페이지 수)
    // console.log("boards: ",boards.value , "totalCount: ",totalCount.value);
  } catch (error) {
    console.error("게시글 조회 실패:", error);
  }
};

//  세션 사용자 조회
const loadSessionUser = async () => {
  try {
    const res = await sessionUser();
    if (res.isLogin) {
      user.value = res.user;
    } else {
      navigateTo("/");
    }
  } catch (err) {
    console.error("세션 조회 실패:", err);
  }
};

//  게시글 등록
const doCreateBoard = async (newBoardData) => {
  try {
    await createBoard(newBoardData);
    alert("게시글이 등록되었습니다.");
    showModal.value = false;
    doLoadBoards();
  } catch (err) {
    console.error("게시글 등록 실패:", err);
  }
};

//  게시글 삭제
const doDeleteBoard = async (boardId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    await deleteBoard(boardId)
    alert("삭제 완료!");
    doLoadBoards();
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
  }
};

//  페이지 변경
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  doLoadBoards();
};

//  로그아웃
const doLogout = async () => {
  try {
    const res = await logout();
    alert("로그아웃 되었습니다.")
    navigateTo("/");
  } catch (err) {
    console.error("로그아웃 실패:", err);
  }
};

//  초기 실행 => layouts/default.vue로 빼기 (script)
onMounted(() => {
  loadSessionUser();
  doLoadBoards();
});

definePageMeta({ ssr: false });
</script>

<style scoped>
.board-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.board-body {
  display: flex;
  flex: 1;
  background-color: #f5f6fa;
  overflow: hidden;
}
</style>
