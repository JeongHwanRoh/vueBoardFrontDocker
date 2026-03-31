import { deleteCard as deleteCardApi } from '~/lib/apiService/kanbanCardApi'
import type { KanbanColumnDto } from '~/lib/types/kanban'
import { useKanbanStore } from '~/stores/kanbanStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export const useKanbanCardActions = () => {
  const kanbanStore = useKanbanStore()
  const { boardId } = storeToRefs(kanbanStore)
  const router = useRouter()

  const editCard = (card: KanbanColumnDto) => {
    console.log('카드 편집:', card)
    router.push({
      path: `/kanban/${card.cardId}`,
      state: {
        title: card.title ?? '',
        cardInfo: card.cardInfo ?? '',
        classification: card.classification ?? '',
        columnName: card.columnName ?? 'TODO',
        orderNum: card.orderNum ?? 0,
        boardId: boardId.value ?? '',
        predictedStartDate: card.predictedStartDate ?? '',
        predictedEndDate: card.predictedEndDate ?? '',
      },
    })
  }

  const deleteCard = async (cardId: number) => {
    console.log('카드 삭제:', cardId)
    await deleteCardApi(cardId)
    kanbanStore.deleteCard(cardId)
  }

  return { editCard, deleteCard }
}