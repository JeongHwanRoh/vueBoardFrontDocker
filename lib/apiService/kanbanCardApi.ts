import axiosApi from './axiosApi';
import type { KanbanCard, KanbanCardDto, KanbanScheduleDto, CreateCardDto, UpdateCardDto, ReorderCardDto, UpdateKanbanCardScheduleStatusRequest } from '~/lib/types/kanban';

// 칸반보드 Card 조회
export const fetchKanbanCards = async (boardId: string): Promise<KanbanCardDto[]> => {
  const res = await axiosApi.get(`/kanban/card/list?boardId=${boardId}`, { withCredentials: true });
  // console.log('fetchKanbanCards response:', res.data); // 응답 데이터 확인
  return res.data as KanbanCardDto[];
};

// 칸반보드 Card 생성 
export const createKanbanCard = async (cardData: CreateCardDto): Promise<KanbanCard> => {
  // console.log('createKanbanCard 요청 데이터:', cardData); // 요청 데이터 확인
  const res = await axiosApi.post(`/kanban/card/create?boardId=${cardData.boardId}`, cardData, { withCredentials: true })
  return res.data
}

// 칸반보드 Card 일정 추가
export const createKanbanCardSchedule = async (scheduleData: { cardId: number; predictedStartDate: string | null; predictedEndDate: string | null }): Promise<void> => {
  // console.log('createKanbanCardSchedule 요청 데이터:', scheduleData); // 요청 데이터 확인
  await axiosApi.patch(`/kanban/card/schedule`, scheduleData, { withCredentials: true });
}


// 칸반보드 Card 업데이트 (상세페이지에서)
export const updateCard = async (cardData: UpdateCardDto): Promise<void> => {
  const res=await axiosApi.patch(`/kanban/card/update?boardId=${cardData.boardId}`, cardData, { withCredentials: true });
  return res.data
};

// 칸반보드 Card 일정 업데이트(상세페이지에서)
export const updateKanbanCardSchedule = async (scheduleData: { cardId: number; predictedStartDate: string | null; predictedEndDate: string | null }): Promise<void> => {
  // console.log('updateKanbanCardSchedule 요청 데이터:', scheduleData);
  await axiosApi.patch(`/kanban/card/schedule/update`, scheduleData, { withCredentials: true });
}

// 칸반보드 Card 일정 업데이트(일정 상태관리 페이지에서)
// 일정 상태관리 페이지의 전체 스케줄 목록 일괄 업데이트 API 호출
export const updateKanbanCardScheduleStatus = async (boardId: string, scheduleData: UpdateKanbanCardScheduleStatusRequest): Promise<void> => {
  // console.log('updateKanbanCardScheduleStatus 요청 데이터:',boardId,",", scheduleData);
  await axiosApi.patch(`/kanban/card/schedule/status/update?boardId=${boardId}`, scheduleData, { withCredentials: true });
}

// 칸반보드 Card 순서 변경 (드래그앤드롭)
export const reorderCards = async (boardId: string, cards: ReorderCardDto[]): Promise<void> => {
  // console.log('reorderCards 요청 데이터:', cards); // 요청 데이터 확인
  await axiosApi.patch(`/kanban/card/reorder?boardId=${boardId}`, cards, { withCredentials: true });
};

// 칸반보드 Card 삭제
export const deleteCard = async (cardId: number): Promise<void> => {
  await axiosApi.delete(`/kanban/card/delete?&cardId=${cardId}`, { withCredentials: true });
}

// 칸반카드 업무 리스트(일정) 조회
export const fetchKanbanCardSchedules = async (boardId: string): Promise<KanbanScheduleDto[]> => {
  const res = await axiosApi.get(`/kanban/card/schedule/list?boardId=${boardId}`, { withCredentials: true });
  // console.log('fetchKanbanCardSchedules response:', res.data); // 응답 데이터 확인
  return res.data as KanbanScheduleDto[];
}