import { createKanbanCard, createKanbanCardSchedule } from "~/lib/apiService/kanbanCardApi"
import type { KanbanCardDto } from "~/lib/types/kanban"

export interface TaskFormData {
    title: string
    classification: string
    description: string
    columnId: string
    startDate: string
    endDate: string
}

export const addKanbanTask = () => {
    const modalCheck = ref(false) // 모달 열림 여부 상태
    const kanbanStore = useKanbanStore() 
    const { columns, boardId } = storeToRefs(kanbanStore) // pinia store 값

    const addTask = async (data: TaskFormData) => {
        console.log("addTask 실행", data)
        if (data.title.trim() === '') return

        if (!boardId.value) {
            console.error('boardId가 없어 업무를 추가할 수 없습니다.')
            return
        }

        try {
            const createdCard = await createKanbanCard({
                title: data.title,
                classification: data.classification || '',
                cardInfo: data.description || '',
                columnName: data.columnId,
                boardId: boardId.value
            })

            await createKanbanCardSchedule({
                cardId: createdCard.cardId,
                predictedStartDate: data.startDate || null,
                predictedEndDate: data.endDate || null,
            })

            const newCard: KanbanCardDto = {
                columnName: data.columnId,
                orderNum: createdCard.orderNum,
                cardId: createdCard.cardId,
                title: createdCard.title,
                cardInfo: data.description || '',
                classification: data.classification || '',
                createdAt: createdCard.createdAt,
                updatedAt: createdCard.updatedAt,
                predictedStartDate: data.startDate || null,
                predictedEndDate: data.endDate || null,
            }

            kanbanStore.addCardToColumn(data.columnId, newCard) // pinia 스토어에 새 카드 추가
            modalCheck.value = false
        } catch (error) {
            console.error('업무 추가 실패:', error)
        }
    }

    return {
        boardId,
        columns,
        modalCheck,
        addTask
    }
}