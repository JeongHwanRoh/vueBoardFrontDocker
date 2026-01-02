<template>
  <h5 class="card-title fw-semibold mb-4">공지사항</h5>
  <!-- 게시판 세부사항 영역 -->
  <BoardDetail :board="board"  :formatter="formatDate" />
  <!-- 버튼 영역 -->
  <div id="btnList" class="d-flex justify-content-end mt-4">
    <button type="button" class="btn btn-primary" @click="goBack()">
      목록으로
    </button>
    <!-- 쿼리 스트링 방식으로 boardId 매개변수 전달 -->
    <router-link :to="{
      path: `board/create`,
      query: { id: boardId }
    }" class="btn btn-primary">
      수정
    </router-link>
    <button type="button" class="btn btn-primary" @click="deleteBoard">
      삭제
    </button>
  </div>
  <!-- 전체 공지글 리스트, 페이징 영역 -->
  <div style="border-top: 2px solid;">
    <BoardTable :columns="tableColumns" :rows="boards" idKey="boardId" />
    <BoardPaging :totalCount="totalCount" :currentPage="currentPage" :totalPages="totalPages"
      @changePage="changePage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BoardDetail from '~/components/organisms/board/BoardDetail.vue';
import { useBoard } from '~/lib/composables/board/fetchAllBoard';
import BoardTable from '~/components/molecules/table/BoardTable.vue';
import BoardPaging from '~/components/organisms/pagination/BoardPaging.vue';
import { fetchBoardAndDelete } from '~/lib/composables/board/fetchBoardDelete';
import { useRouter } from 'vue-router';

const router = useRouter();

// composable에서 상태+로직 가져오기(전체테이블 불러오기)
const {
  boards,
  currentPage,
  totalCount,
  totalPages,
  getBoard,
  changePage

} = useBoard(10)

// composable에서 상태+로직 가져오기(특정 게시글 조회 및 삭제)
const {
  board,
  boardId,
  fetchBoard,
  deleteBoard,

} = fetchBoardAndDelete()

// composable에서 상태+로직 가져오기(첨부된 파일 조회 및 다운로드)
// const {
//   route,
//   file,
//   fetchFile,
//   handleDownload

// } = fetchFileDownload()

// 날짜 포맷 함수
const formatDate = (timestamp: string | number | null | undefined) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 돌아가기
const goBack = () => {
  router.push('/board')
}

// 테이블 컬럼 정의(BoardTable 컴포넌트에 보낼 컬럼)
const tableColumns = [
  { key: 'boardId', label: '번호' },  // idKey=boardId
  {
    key: 'title',
    label: '제목',
    isLink: true,
    to: (row: any) => `/board/${row.boardId}`  // 상세페이지로 라우팅
  },
  { key: 'writer', label: '작성자' },
  {
    key: 'regdate',
    label: '등록날짜',
    format: (value: any, row: any) => formatDate(row.updatedAt || row.regdate)
  },
  { key: 'viewcnt', label: '조회수' },
];

// 마운트 시 실행
onMounted(() => {
  fetchBoard()
  getBoard()
})

</script>
<style scoped>
#title-userinfo {
  display: flex;
  flex-direction: row;
  /* 세로 정렬 */
  align-items: flex-end;
  /* 오른쪽 정렬 */
  justify-content: space-between;
  padding: 8px;
}

#userinfo span {
  display: block;
  /* 줄바꿈 가능 */
}

.userinfo {
  display: flex;
  gap: 40px;
}

#btnList {
  padding: 0px 0px 30px;
}

/* 251119: styles.min.css 코드 지역으로 옮김 */
.form-control {
  display: block;
  width: 100%;
  padding: 8px;
  /* 제목 부분과 css 맞춤 */
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--bs-body-color);
  background-color: transparent;
  background-clip: padding-box;
  border: var(--bs-border-width) solid #dbe1e6;


}

.table> :not(caption)>*>* {
  padding: 5px;
  /* 테이블 padding 줄임 */
  color: var(--bs-table-color-state, var(--bs-table-color-type, var(--bs-table-color)));
  background-color: var(--bs-table-bg);
  border-bottom-width: var(--bs-border-width);
  -webkit-box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
  box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
}
</style>