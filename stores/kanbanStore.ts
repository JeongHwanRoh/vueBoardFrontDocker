/* 
1. 칸반 화면에서 사용하는 프런트 상태 보관
2. api 호출 결과를 화면용 데이터로 정리하는 중앙 저장소 역할
*/

import { defineStore } from 'pinia'

import type {
  KanbanBoard,
  KanbanBoardColumn,
  KanbanCardDto,
  KanbanScheduleDateKey,
  KanbanScheduleDto,
  KanbanScheduleStatus,
} from '~/lib/types/kanban'


// 칸반 보드 최초 렌더 시 사용하는 기본 3개 컬럼
const createDefaultColumns = (): KanbanBoardColumn[] => [
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

// 오늘 날짜를 로컬 시간 기준 'YYYY-MM-DD' 형식으로 반환
const getTodayDateString = (): string => {
  const today = new Date()
  const timezoneOffset = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

// 서버에서 받은 스케줄 상태값(영어형태)를 한글 형태로 보정하는 유틸 함수
const normalizeScheduleStatus = (status: string | null | undefined): KanbanScheduleStatus | null => {
  if (!status) return null;

  if (['TODO', '예정'].includes(status)) return 'TODO';
  if (['IN_PROGRESS', '진행중', '진행 중'].includes(status)) return 'IN_PROGRESS';
  if (['DONE', '완료'].includes(status)) return 'DONE';

  return null;
};

// 실제 시작일, 실제 종료일에 따른 스케줄 상태 계산 로직
const resolveScheduleStatus = (schedule: Pick<KanbanScheduleDto, 'actualStartDate' | 'actualEndDate'>): KanbanScheduleStatus | null => {
  const actualStartDate = normalizeScheduleDateValue(schedule.actualStartDate)
  const actualEndDate = normalizeScheduleDateValue(schedule.actualEndDate)

  if (!actualStartDate) {
    return 'TODO'

  }

  if (actualEndDate) {
    return 'DONE'
  }

  return getTodayDateString() >= actualStartDate ? 'IN_PROGRESS' : 'TODO' // 오늘 날짜가 실제 시작일보다 같거나 이후면 IN_PROGRESS, 그렇지 않으면 TODO
}

// 서버 응답을 화면에서 쓰기 쉬운 형태로 보정하고, cardId 타입도 일관되게 맞춤
const normalizeSchedule = (schedule: KanbanScheduleDto): KanbanScheduleDto => ({
  ...schedule,
  cardId: Number(schedule.cardId),
  predictedStartDate: normalizeScheduleDateValue(schedule.predictedStartDate),
  predictedEndDate: normalizeScheduleDateValue(schedule.predictedEndDate),
  actualStartDate: normalizeScheduleDateValue(schedule.actualStartDate),
  actualEndDate: normalizeScheduleDateValue(schedule.actualEndDate),
  status: normalizeScheduleStatus(schedule.status) ?? resolveScheduleStatus(schedule),
})

// 상태 타입 정의
export interface KanbanState {
  board: KanbanBoard | null;
  columns: KanbanBoardColumn[];
  schedules: KanbanScheduleDto[];
  isLoading: boolean;
  errorMessage: string | null;
}

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
    allCards: (state): KanbanCardDto[] =>
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
    setColumns(columns: KanbanBoardColumn[]) {
      this.columns = columns
      if (this.board) {
        this.board = {
          ...this.board,
          columns,
        }
      }
    },

    // 서버 카드 목록을 기본 컬럼 구조에 매핑하고 orderNum 기준 정렬
    setCardsByColumn(cards: KanbanCardDto[]) {
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
    // 새 카드를 해당 컬럼에 추가하고 순서를 재정렬
    addCardToColumn(columnName: string, card: KanbanCardDto) {
      const targetColumn = this.columns.find((column) => column.columnName === columnName)
      if (!targetColumn) return

      targetColumn.cards.push(card)
      targetColumn.cards.sort((a, b) => a.orderNum - b.orderNum)
    },
    // 카드 업데이트 함수: 카드 ID로 해당 카드를 찾아 업데이트 내용을 병합, 컬럼 이동이 필요한 경우 이전 컬럼에서 제거 후 새 컬럼으로 추가
    updateCard(cardId: number, updates: Partial<KanbanCardDto>) {
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
    // 사용자가 날짜를 변경할 때마다 해당 카드의 스케줄 상태를 프런트상에 임시 업데이트
    updateScheduleDate(cardId: number, key: KanbanScheduleDateKey, value: string | null) {
      const targetSchedule = this.schedules.find((schedule) => String(schedule.cardId) === String(cardId))
      if (!targetSchedule) {
        console.warn('updateScheduleDate 대상 스케줄을 찾지 못했습니다.', {
          cardId,
          key,
          value,
          scheduleIds: this.schedules.map((schedule) => schedule.cardId),
        })
        return
      }

      const normalizedValue = normalizeScheduleDateValue(value)
      targetSchedule[key] = normalizedValue as never

      if (key === 'actualStartDate' && !normalizedValue) {
        targetSchedule.actualEndDate = null
      }

      targetSchedule.status = resolveScheduleStatus(targetSchedule)
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