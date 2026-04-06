import { deleteCard as deleteCardApi, updateCard as updateCardApi, updateKanbanCardSchedule } from '~/lib/apiService/kanbanCardApi'
import type { KanbanColumnDto, UpdateCardDto } from '~/lib/types/kanban'
import { useKanbanStore } from '~/stores/kanbanStore'
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'

interface KanbanCardUpdateFormRefs {
  cardId: number
  title: Ref<string>
  description: Ref<string>
  classification: Ref<string>
  columnId: Ref<string>
  orderNum: Ref<number>
  boardId: Ref<string>
  predictedStartDate: Ref<string>
  predictedEndDate: Ref<string>
}

export const useKanbanCardActions = (updateForm?: KanbanCardUpdateFormRefs) => {
  const kanbanStore = useKanbanStore()
  const { boardId } = storeToRefs(kanbanStore)
  const router = useRouter()

  // 카드 편집 함수
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

  // 카드 삭제 함수
  const deleteCard = async (cardId: number) => {
    console.log('카드 삭제:', cardId)
    await deleteCardApi(cardId)
    kanbanStore.deleteCard(cardId)
  }
  // 카드 업데이트 핸들러
  const handleUpdate = async () => {
    debugger;
    if (!updateForm) {
      throw new Error('카드 업데이트 폼 데이터가 없습니다.')
    }

    await updateKanbanCard({
      cardId: updateForm.cardId,
      columnName: updateForm.columnId.value,
      title: updateForm.title.value,
      classification: updateForm.classification.value,
      orderNum: updateForm.orderNum.value,
      cardInfo: updateForm.description.value,
      predictedStartDate: updateForm.predictedStartDate.value || null,
      predictedEndDate: updateForm.predictedEndDate.value || null,
      boardId: updateForm.boardId.value,
    })
  }

  // 카드 상세페이지 내  업데이트 함수(카드 내용,예상시작날짜, 예상종료날짜)
  const updateKanbanCard = async (cardData: UpdateCardDto) => {
    if (
      cardData.predictedStartDate &&
      cardData.predictedEndDate &&
      cardData.predictedStartDate > cardData.predictedEndDate
    ) {
      alert('시작 날짜는 종료 날짜보다 이후일 수 없습니다.')
      return
    }
    await updateCardApi(cardData)
    await updateKanbanCardSchedule({
      cardId: cardData.cardId,
      predictedStartDate: cardData.predictedStartDate,
      predictedEndDate: cardData.predictedEndDate,
    })
    kanbanStore.updateCard(cardData.cardId, {
      columnName: cardData.columnName,
      title: cardData.title,
      classification: cardData.classification,
      orderNum: cardData.orderNum,
      cardInfo: cardData.cardInfo,
      predictedStartDate: cardData.predictedStartDate,
      predictedEndDate: cardData.predictedEndDate,
    })
    router.push('/kanban')
  }
  return { editCard, deleteCard, handleUpdate, updateKanbanCard }
}