import { defineStore } from 'pinia'

import type {
  CreateCardDto,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnDto,
} from '~/lib/types/kanban'

// 상태 타입 정의
export interface KanbanState {
  board: KanbanBoard | null;
  columns: KanbanColumn[];
  isLoading: boolean;
  errorMessage: string | null;
}

// 칸반 보드 최초 렌더 시 사용하는 기본 3개 컬럼
const createDefaultColumns = (): KanbanColumn[] => [
  {
    columnName: 'TODO',
    columnTitle: '예정',
    cards: [],
  },
  {
    columnName: 'IN_PROGRESS',
    columnTitle: '진행중',
    cards: [],
  },
  {
    columnName: 'DONE',
    columnTitle: '완료',
    cards: [],
  },
]

export const useKanbanStore = defineStore('kanban', {
  // 전역 원본 상태
  state: (): KanbanState => ({
    board: null,
    columns: createDefaultColumns(),
    isLoading: false,
    errorMessage: null,
  }),

  getters: {
    // board가 없을 때도 항상 문자열을 반환하도록 보정
    boardId: (state): string => state.board?.boardId ?? '',
    hasBoard: (state): boolean => !!state.board?.boardId,
    // 화면에서 전체 카드가 필요할 때 컬럼 배열을 평탄화
    allCards: (state): KanbanColumnDto[] =>
      state.columns.flatMap((column) => column.cards),
  },

  actions: {
    // 조회한 board 정보를 저장
    setBoard(board: KanbanBoard | null) {
      this.board = board
    },

    // 컬럼 상태를 교체하고 board 내부 columns도 함께 동기화
    setColumns(columns: KanbanColumn[]) {
      this.columns = columns
      if (this.board) {
        this.board = {
          ...this.board,
          columns,
        }
      }
    },

    // 서버 카드 목록을 기본 컬럼 구조에 매핑하고 orderNum 기준 정렬
    setCardsByColumn(cards: KanbanColumnDto[]) {
      const nextColumns = createDefaultColumns().map((column) => ({
        ...column,
        cards: cards
          .filter((card) => card.columnName === column.columnName)
          .sort((a, b) => a.orderNum - b.orderNum),
      }))

      this.setColumns(nextColumns)
    },

    // 새 카드를 해당 컬럼에 추가하고 순서를 재정렬
    addCardToColumn(columnName: string, card: KanbanColumnDto) {
      const targetColumn = this.columns.find((column) => column.columnName === columnName)
      if (!targetColumn) return

      targetColumn.cards.push(card)
      targetColumn.cards.sort((a, b) => a.orderNum - b.orderNum)
    },

    // 카드 id로 찾아 부분 업데이트 (컬럼 변경 시 이동 처리 포함)
    updateCard(cardId: number, updates: Partial<KanbanColumnDto>) {
      for (const column of this.columns) {
        const cardIndex = column.cards.findIndex((card) => card.cardId === cardId)
        if (cardIndex === -1) continue

        const targetCard = column.cards[cardIndex]
        if (!targetCard) return

        // 컬럼이 변경된 경우 이전 컬럼에서 제거 후 새 컬럼으로 이동
        if (updates.columnName && updates.columnName !== column.columnName) {
          column.cards.splice(cardIndex, 1)
          const updatedCard = { ...targetCard, ...updates }
          this.addCardToColumn(updates.columnName, updatedCard)
        } else {
          Object.assign(targetCard, updates)
        }
        return
      }
    },

    // 모든 컬럼에서 동일 cardId를 제거
    deleteCard(cardId: number) {
      this.columns.forEach((column) => {
        column.cards = column.cards.filter((card) => card.cardId !== cardId)
      })
    },

    // 로그아웃/초기화 시 칸반 상태를 기본값으로 리셋
    clearKanban() {
      this.board = null
      this.columns = createDefaultColumns()
      this.errorMessage = null
      this.isLoading = false
    },
  },
})