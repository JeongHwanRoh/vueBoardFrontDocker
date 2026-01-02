import { loadBoards } from '~/lib/apiService/boardApi';
import type { BoardResponse } from '~/lib/types/board';

export const useBoard=(pageSize=10)=>{
    const boards = ref<BoardResponse[]>([]);
    const currentPage = ref(1);
    const totalCount = ref(0);
    const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

        // 게시글 목록 조회
    const getBoard = async () => {
        try {
            const res = await loadBoards(currentPage.value, pageSize);
            boards.value = res.boards; 
            console.log("res값", res);
            totalCount.value = res.totalCount; // 총 개수
            console.log("response값", boards.value);
            console.log("boardid값: ", boards.value[0]?.boardId);
        } catch (error) {
            console.error("공지글 조회 실패: ", error);
        }
    }

    // 페이지 변경
    const changePage = async (page: number) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;
        await getBoard();
    }

    return {
        boards,
        currentPage,
        totalCount,
        totalPages,
        getBoard,
        changePage,
    }

}
