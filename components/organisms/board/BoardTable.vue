<template>
  <table class="board-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>제목</th>
        <th>작성자</th>
        <th>등록일</th>
        <th>조회수</th>
        <th>카테고리</th>
        <th>삭제</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="board in boards" :key="board.boardId">
        <td>{{ board.boardId }}</td>

        <!-- 제목 클릭 시 상세 이동 이벤트 emit -->
        <!-- 해당 제목에 맞는 board를 boardTable->BoardMain -> list.vue로 올림
              list.vue에
         -->
        <td>
          <span class="result-title">
            <a :href="`http://localhost:3000/board/detail?id=${board.boardId}`">{{ board.title }}</a>
          </span>
        </td>

        <td>{{ board.writerId }}</td>
        <td>{{ formatDate(board.regdate) }}</td>
        <td>{{ board.viewcnt }}</td>
        <td>{{ board.category }}</td>

        <td>
          <button class="deleteBoard" @click="$emit('delete', board.boardId)">
            삭제
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>

import boardApi from '@/lib/apiService/boardApi.ts';






//  날짜 포맷 함수 (단순 변환)
const formatDate = (date) => new Date(date).toLocaleDateString();
</script>

<style scoped>
.board-table {
  width: 100%;
  border-collapse: collapse;
}

.board-table th,
.board-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.link-title {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.link-title:hover {
  color: #0056b3;
}

.deleteBoard {
  background-color: red;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.deleteBoard:hover {
  background-color: darkred;
}
</style>
