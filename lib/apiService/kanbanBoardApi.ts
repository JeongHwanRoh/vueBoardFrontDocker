import axiosApi from './axiosApi';
import type { KanbanBoard } from '~/lib/types/kanban';

//  현재 로그인 사용자의 TB_KANBAN_BOARD.boardId 조회
export const fetchKanbanBoardId = async (): Promise<KanbanBoard> => {

    const res = await axiosApi.get('/kanban/board/boardId', { withCredentials: true });
    console.log('fetchKanbanBoardId response:', res.data); // 응답 데이터 확인
    return res.data;
}