export interface KanbanBoard {
  boardId: string;
  pn: number;
  boardName: string;
  columns: KanbanColumn[];
}

export interface KanbanCard {
  id: string;
  boardId: string;  // Board FK 추가
  title: string;
  description?: string;
  status: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  cards: KanbanCard[];
}

export interface CreateCardDto {
  title: string;
  description?: string;
  status: string;
  order: number;
  // boardId는 서버에서 세션으로 자동 설정
}

export interface UpdateCardDto {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  order?: number;
}