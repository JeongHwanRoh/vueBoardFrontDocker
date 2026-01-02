<template>
    <div>
        <h5 class="card-title fw-semibold mb-4">공지사항</h5>
        <!-- 게시판 테이블 영역 -->
        <BoardTable :columns="tableColumns" :rows="boards" idKey="boardId" />
        <div class="submitBtn">
            <BtnBw field="게시판 신규 작성" @click="addNotice"></BtnBw>
        </div>

        <div>
            <!-- 페이징 버튼 -->
            <BoardPaging :totalCount="totalCount" :currentPage="currentPage" :totalPages="totalPages"
                @changePage="changePage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BoardPaging from '~/components/organisms/pagination/BoardPaging.vue';
import BoardTable from '~/components/molecules/table/BoardTable.vue';
import { useBoard } from '~/lib/composables/board/fetchAllBoard';
import BtnBw from '~/components/atoms/BtnBW.vue';

// 상태 변수
const router = useRouter();
// composable에서 상태+로직 가져오기
const {
    boards,
    currentPage,
    totalCount,
    totalPages,
    getNotice,
    changePage

} = useBoard(10)


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

// 추가버튼 핸들러
function addNotice() {
    router.push("/board/create")
}

// 마운트 시 실행
onMounted(() => {
    getNotice();
    // console.log("boardid값: ", boards.value[0]?.boardId);

})
</script>

<style scoped>
/* 251119: styles.min.css 코드 지역으로 옮김 */
.table> :not(caption)>*>* {
    padding: 9px;
    /* 테이블 padding 줄임 */
    color: var(--bs-table-color-state, var(--bs-table-color-type, var(--bs-table-color)));
    background-color: var(--bs-table-bg);
    border-bottom-width: var(--bs-border-width);
    -webkit-box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
    box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
}

/* 251121: div 태그 내 신규작성 버튼 우측정렬 */
.submitBtn {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}
</style>