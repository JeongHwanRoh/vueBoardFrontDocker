import { defineStore } from 'pinia'

import type {
  CreateCardDto,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnDto,
  KanbanScheduleDateKey,
  KanbanScheduleDto,
} from '~/lib/types/kanban'

// 상태 타입 정의
export interface KanbanState {
  board: KanbanBoard | null;
  columns: KanbanColumn[];
  schedules: KanbanScheduleDto[];
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

// 날짜 문자열을 보정하여 'YYYY-MM-DD' 형식으로 통일하는 유틸 함수
const normalizeScheduleDateValue = (value: string | null | undefined): string | null => {
  if (!value) return null

  const trimmedValue = String(value).trim()
  if (!trimmedValue) return null

  const matchedDate = trimmedValue.match(/^\d{4}-\d{2}-\d{2}/)
  return matchedDate ? matchedDate[0] : trimmedValue
}

// 오늘 날짜를 'YYYY-MM-DD' 형식으로 반환하는 유틸 함수 (시간대 보정 포함)
const getTodayDateString = (): string => {
  const today = new Date()
  const timezoneOffset = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

// 실제 시작일, 실제 종료일에 따른 스케줄 상태 계산 로직
const resolveScheduleStatus = (schedule: Pick<KanbanScheduleDto, 'actualStartDate' | 'actualEndDate'>): string | null => {
  const actualStartDate = normalizeScheduleDateValue(schedule.actualStartDate)
  const actualEndDate = normalizeScheduleDateValue(schedule.actualEndDate)

  if (!actualStartDate) {
    return '예정'
  }

  if (actualEndDate) {
    return '완료'
  }

  return getTodayDateString() >= actualStartDate ? '진행중' : '예정'
}

// 서버에서 받아온 스케줄 데이터를 보정하되, 초기 status는 백엔드 값을 우선 사용
const normalizeSchedule = (schedule: KanbanScheduleDto): KanbanScheduleDto => ({
  ...schedule,
  predictedStartDate: normalizeScheduleDateValue(schedule.predictedStartDate),
  predictedEndDate: normalizeScheduleDateValue(schedule.predictedEndDate),
  actualStartDate: normalizeScheduleDateValue(schedule.actualStartDate),
  actualEndDate: normalizeScheduleDateValue(schedule.actualEndDate),
  status: schedule.status ?? resolveScheduleStatus(schedule),
})

export const useKanbanStore = defineStore('kanban', {
  // 전역 원본 상태
  state: (): KanbanState => ({
    board: null,
    columns: createDefaultColumns(),
    schedules: [],
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
    // 화면에서 전체 스케줄이 필요할 때 schedules 배열을 반환
    allSchedules: (state): KanbanScheduleDto[] => state.schedules,
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

    // 조회한 스케줄 목록을 보정하여 저장
    setSchedules(schedules: KanbanScheduleDto[]) {
      this.schedules = schedules.map(normalizeSchedule)
    },

    // 카드 일정 업데이트 시 해당 카드의 스케줄 정보를 찾아 날짜 보정 및 상태 재계산 후 저장
    updateScheduleDate(cardId: number, key: KanbanScheduleDateKey, value: string | null) {
      const targetSchedule = this.schedules.find((schedule) => schedule.cardId === cardId)
      if (!targetSchedule) return

      const normalizedValue = normalizeScheduleDateValue(value)
      targetSchedule[key] = normalizedValue as never

      if (key === 'actualStartDate' && !normalizedValue) {
        targetSchedule.actualEndDate = null
      }

      targetSchedule.status = resolveScheduleStatus(targetSchedule)
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
      this.schedules = []
      this.errorMessage = null
      this.isLoading = false
    },
  },
})