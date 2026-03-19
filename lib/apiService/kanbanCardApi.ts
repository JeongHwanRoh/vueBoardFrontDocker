import axiosApi from './axiosApi';
import type { KanbanCard, KanbanColumnDto, CreateCardDto, UpdateCardDto, ReorderCardDto } from '~/lib/types/kanban';

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

// 칸반보드 Card 순서 변경 (드래그앤드롭)
export const reorderCards = async (boardId: string, cards: ReorderCardDto[]): Promise<void> => {
  console.log('reorderCards 요청 데이터:', cards); // 요청 데이터 확인
  await axiosApi.patch(`/kanban/card/reorder?boardId=${boardId}`, cards, { withCredentials: true });
};

// 칸반보드 Card 삭제
export const deleteCard = async (cardId: number): Promise<void> => {
  await axiosApi.delete(`/kanban/card/delete?&cardId=${cardId}`, { withCredentials: true });
}
