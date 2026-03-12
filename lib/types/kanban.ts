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
  cardInfo: string;
  createdAt: string;
  updatedAt: string;

}

export interface CreateCardDto {
  title: string;
  cardInfo: string;
  columnName: string;
  orderNum: number;
  // boardId는 서버에서 세션으로 자동 설정
}

// export interface UpdateCardDto {
//   id: string;
//   title?: string;
//   description?: string;
//   status?: string;
//   order?: number;
// }