import type { BoardResponse } from '~/lib/types/board';
import { useRouter, useRoute } from 'vue-router';
import { loadBoardDetail, deleteBoards } from '~/lib/apiService/boardApi';


export const fetchBoardAndDelete = () => {
    const router = useRouter();
    const route = useRoute();
    const board = ref<BoardResponse | null>(null);
    const boardId = ref(Number(route.params.boardId))


    // 게시글 목록 중 해당 boardId에 해당하는 게시글 상세조회
    const fetchBoard = async () => {
        try {
            if (!boardId.value) throw new Error("유효하지 않은 게시글 ID입니다.");
            const res = await loadBoardDetail(boardId.value);
            board.value = res;
            console.log("상세조회res:", res);
        } catch (error) {
            console.error("게시글 상세조회 실패:", error);
        }
    }

    // 게시글 삭제
    const deleteBoard = async () => {
        try {
            if (!boardId.value) throw new Error('게시글 ID 없음')
            await deleteBoards(boardId.value)
            router.push('/board')
        } catch (error) {
            console.error('게시글 삭제 실패:', error)
        }
    }

    return {
        board,
        boardId,
        fetchBoard,
        deleteBoard,
    }
}