import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KanbanBoard, KanbanColumn, KanbanCard } from '~/lib/types/kanban'


export const useKanbanStore = defineStore('kanban', () => {
  // 기존 Board -> KanbanBoard
  const board = ref<KanbanBoard>({
    columns: [],
    boardId: '',
    pn: 0,
    boardName: ''
  })

  // 필요 시 개별 컬럼 접근
  const columns = computed<KanbanColumn[]>(() => board.value.columns)

  // 기존 Task -> KanbanCard
  const addCard = (columnId: string, card: KanbanCard) => {
    const column = board.value.columns.find((c) => c.columnId === columnId)
    if (!column) return
    column.cards.push(card)
  }

  const updateCard = (cardId: string, updates: Partial<KanbanCard>) => {
    for (const column of board.value.columns) {
      const target = column.cards.find((c) => c.cardId === parseInt(cardId, 10))
      if (target) {
        Object.assign(target, updates)
        return
      }
    }
  }

  const removeCard = (cardId: string) => {
    for (const column of board.value.columns) {
      column.cards = column.cards.filter((c) => c.cardId !== parseInt(cardId, 10))
    }
  }

  return {
    board,
    columns,
    addCard,
    updateCard,
    removeCard
  }
})