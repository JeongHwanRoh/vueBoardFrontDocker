<template>

    <h1>게시글 작성</h1>
    <BoardInputForm :board="board" :isUpdate="isUpdate" :isSubmit="isSubmit" @submit="submitBoard" @cancel="goBack" />
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import BoardInputForm from '~/components/organisms/board/BoardInputForm.vue';
import { loadBoardDetail } from '~/lib/apiService/boardApi';
import { submitBoards } from '~/lib/composables/board/submitBoard';

// 상태 변수
const router = useRouter();
const {
    board, boardId, isUpdate, isSubmit, submitBoard,
} = await submitBoards()

// 돌아가기
const goBack = () => {
    router.push('/board');
}

//수정모드일 경우 기존 데이터 로드
onMounted(async () => {
    console.log("쿼리스트링으로 보내진 boardId값 : ", boardId.value);
    if (isUpdate.value) {
        // 게시글 불러오기
        const res1 = await loadBoardDetail(boardId.value!); // ! : Non-null assertion Operator (업데이트 모드에서만 호출)
        board.value = res1;

    }
}
)
</script>