import axiosApi from './axiosApi';
import type { KanbanCard, KanbanColumnDto, CreateCardDto, UpdateCardDto } from '~/lib/types/kanban';

// 칸반보드 Card 조회
export const fetchKanbanCards = async (boardId: string): Promise<KanbanColumnDto[]> => {
  const res = await axiosApi.get(`/kanban/card/list?boardId=${boardId}`, { withCredentials: true });
  console.log('fetchKanbanCards response:', res.data); // 응답 데이터 확인
  return res.data as KanbanColumnDto[];
};

// 칸반보드 Card 생성 
/// ulid는 백엔드에서 생성, 프런트에서는 
export const createKanbanCard = async (cardData: CreateCardDto): Promise<KanbanCard> => {
  const res = await axiosApi.post(`/kanban/card/create?boardId=${cardData.boardId}`, cardData, { withCredentials: true })
  return res.data
}
// 칸반보드 Card 업데이트 (상세페이지에서)
export const updateCard = async (cardData: UpdateCardDto): Promise<void> => {
  const res=await axiosApi.patch(`/kanban/card/update?boardId=${cardData.boardId}`, cardData, { withCredentials: true });
  return res.data
};

// // 칸반보드 Card 순서 변경 (백엔드 미구현)
export const reorderCards = async (cards: { id: number; order: number; status: string }[]): Promise<void> => {
  await axiosApi.patch('/kanban/reorder', { cards });
};
