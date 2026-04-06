// Kanban 관련 타입 정의
export interface KanbanBoard {
  boardId: string;
  pn: number;
  boardName: string;
  columns: KanbanBoardColumn[];
}

// DB에서 가져온 card 정보를 담은 column 정보(조회용)
export interface KanbanCard {
  cardId: number;
  columnId: number;
  title: string;
  classification: string;
  orderNum: number;
  createdAt: string;
  updatedAt: string;
}

// 컬럼 단위 타입
export interface KanbanBoardColumn {
  columnName:string;
  columnTitle: string;
  cards: KanbanCardDto[];
}

// DB에서 COLUMN, CARD, CARD_INFO를 JOIN해서 가져올 때 사용할 DTO (개별 카드 정보 조회용)
export interface KanbanCardDto{
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

// DB에서 COLUMN, CARD, CARD_INFO를 JOIN해서 가져올 때 사용할 DTO
export interface CreateCardDto {
  title: string;
  classification: string;
  cardInfo: string;
  columnName: string;
  boardId: string;
}

// DB에서 COLUMN, CARD, CARD_INFO를 JOIN해서 가져올 때 사용할 DTO
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

// 카드 순서 변경 시 사용할 DTO
export interface ReorderCardDto {
  cardId: number;
  columnName: string;
  orderNum: number;
}


export type KanbanScheduleDateKey =
  | 'predictedStartDate'
  | 'predictedEndDate'
  | 'actualStartDate'
  | 'actualEndDate'

// 스케줄 상태값 정의
export type KanbanScheduleStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

// 상세페이지에서 카드 스케줄 상태 조회 시 사용할 DTO
export interface KanbanScheduleDto {
    cardId: number
    // title: string
    // classification: string
    // cardInfo: string
    predictedStartDate: string | null
    predictedEndDate: string | null
    actualStartDate: string | null
    actualEndDate: string | null
    status: KanbanScheduleStatus | null
}

// 스케줄 관리 페이지에서 카드 스케줄 상태 업데이트 시 사용할 DTO
export interface UpdateKanbanScheduleStatusDto {
    cardId: number
    predictedStartDate: string | null
    predictedEndDate: string | null
    actualStartDate: string | null
    actualEndDate: string | null
    status: KanbanScheduleStatus | null
}

export interface UpdateKanbanCardScheduleStatusRequest {
  schedules: UpdateKanbanScheduleStatusDto[]
}