import axiosApi from './axiosApi';
import type { KanbanCard, CreateCardDto, UpdateCardDto } from '~/lib/types/kanban';

// 칸반보드 Card 조회
export const fetchKanbanCards = async (): Promise<KanbanCard[]> => {
  const res = await axiosApi.get('/kanban');
  return res.data;
};

// 칸반보드 Card 생성
export const createKanbanCard = async (card: CreateCardDto): Promise<KanbanCard> => {
  const res = await axiosApi.post('/kanban', card);
  return res.data;
};

// 칸반보드 Card 수정
export const updateKanbanCard = async (cardData: UpdateCardDto): Promise<KanbanCard> => {
  const { id, ...updateData } = cardData;
  const res = await axiosApi.put(`/kanban/${id}`, updateData);
  return res.data;
};

// 칸반보드 Card 삭제
export const deleteKanbanCard = async (id: string): Promise<void> => {
  await axiosApi.delete(`/kanban/${id}`);
};

// 칸반보드 Card 상태 변경
export const updateCardStatus = async (id: string, status: string, order: number): Promise<KanbanCard> => {
  const res = await axiosApi.patch(`/kanban/${id}/status`, { status, order });
  return res.data;
};

// 칸반보드 Card 순서 변경
export const reorderCards = async (cards: { id: string; order: number; status: string }[]): Promise<void> => {
  await axiosApi.patch('/kanban/reorder', { cards });
};
