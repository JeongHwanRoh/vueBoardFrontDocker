export interface KanbanBoard {
  boardId: string;
  pn: number;
  boardName: string;
  columns: KanbanColumn[];
}

export interface KanbanCard {

  cardId: number;
  columnId: number;
  title: string;
  classification: string;
  orderNum: number;
  createdAt: string;
  updatedAt: string;

	
}

// DB에서 가져온 card 정보를 담은 column 정보(조회용)
export interface KanbanColumn {
  columnName:string;
  columnTitle: string;
  cards: KanbanColumnDto[];
}

// DB에서 COLUMN, CARD, CARD_INFO를 JOIN해서 가져올 때 사용할 DTO
export interface KanbanColumnDto{
  columnName: string;
  orderNum: number;
  cardId: number;
  title:string;
  classification: string;
  cardInfo: string;
  predictedStartDate: string | null;
  predictedEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  title: string;
  classification: string;
  cardInfo: string;
  columnName: string;
  boardId: string;
}

export interface UpdateCardDto {
  cardId: number;
  columnName: string;
  title: string;
  orderNum: number;
  cardInfo: string;
  classification: string;
  predictedStartDate: string | null;
  predictedEndDate: string | null;
  boardId: string;
}

export interface ReorderCardDto {
  cardId: number;
  columnName: string;
  orderNum: number;
}

export interface KanbanScheduleDto {
    cardId: number
    title: string
    classification: string
    cardInfo: string
    predictedStartDate: string
    predictedEndDate: string
    actualStartDate: string
    actualEndDate  : string
    status: string
}