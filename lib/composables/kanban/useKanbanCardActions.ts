import { deleteCard as deleteCardApi, updateCard as updateCardApi, updateKanbanCardSchedule } from '~/lib/apiService/kanbanCardApi'
import type { KanbanCardDto, UpdateCardDto } from '~/lib/types/kanban'
import { useKanbanStore } from '~/stores/kanbanStore'
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'

// 상세페이지에서 업데이트 목적으로 입력한 카드 정보 타입 정의
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
  const { boardId } = storeToRefs(kanbanStore) // pinia store에서 boardId 가져오기
  const router = useRouter()

  // 카드 편집 함수
  const editCard = (card: KanbanCardDto) => {
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
  // handleUpdate에서 updateForm 입력받아서 updateKanbanCard로 업데이트 API 호출
  const handleUpdate = async () => {
    if (!updateForm) {
      throw new Error('카드 업데이트 폼 데이터가 없습니다.')
    }
    // updateForm: 업데이트 폼에서 입력된 카드 정보 (카드 ID, 제목, 설명, 분류, 컬럼 ID, 순서 번호, 보드 ID, 예상 시작 날짜, 예상 종료 날짜)
    // kanban.ts의 UpdateCardDto 타입과 일치해야 함
    await updateKanbanCard({
      cardId: updateForm.cardId,
      columnName: updateForm.columnId.value,
      title: updateForm.title.value,
      orderNum: updateForm.orderNum.value,
      cardInfo: updateForm.description.value,
      classification: updateForm.classification.value,
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
    await updateCardApi(cardData) // 카드 내용 업데이트 API 호출
    await updateKanbanCardSchedule({ // 카드 일정 업데이트 API 호출
      cardId: cardData.cardId,
      predictedStartDate: cardData.predictedStartDate,
      predictedEndDate: cardData.predictedEndDate,
    })
    // 업데이트된 카드 정보를 pinia 스토어에 반영
    kanbanStore.updateCard(cardData.cardId, {
      columnName: cardData.columnName,
      title: cardData.title,
      orderNum: cardData.orderNum,
      cardInfo: cardData.cardInfo,
      classification: cardData.classification,
      predictedStartDate: cardData.predictedStartDate,
      predictedEndDate: cardData.predictedEndDate,
    })
    // 업데이트 완료 후 칸반 보드 메인 페이지로 이동
    router.push('/kanban')
  }
  return { editCard, deleteCard, handleUpdate, updateKanbanCard }
}