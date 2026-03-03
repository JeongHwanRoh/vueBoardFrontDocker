export interface KanbanCard {
  id: string;
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

export interface KanbanBoard {
  columns: KanbanColumn[];
}

export interface CreateCardDto {
  title: string;
  description?: string;
  status: string;
  order: number;
}

export interface UpdateCardDto {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  order?: number;
}