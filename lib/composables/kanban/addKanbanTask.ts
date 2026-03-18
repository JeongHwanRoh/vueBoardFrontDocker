import { createKanbanCard } from "~/lib/apiService/kanbanCardApi"
import type { KanbanColumnDto } from "~/lib/types/kanban"

export const addKanbanTask = () => {
    const modalCheck = ref(false)
    const kanbanStore = useKanbanStore()
    const { columns, boardId } = storeToRefs(kanbanStore)
    const newTaskTitle = ref('')
    const newTaskDescription = ref('')
    const selectedColumnId = ref('TODO')
    const addTask = async () => {
        console.log("addTask 실행")
        console.log("newTaskTitle:", newTaskTitle.value)
        if (newTaskTitle.value.trim() === '') return

        if (!boardId.value) {
            console.error('boardId가 없어 업무를 추가할 수 없습니다.')
            return
        }

        // 참고: selectedColumnId.value는 "TODO", "IN_PROGRESS", "DONE" 중 하나의 값을 가짐
        // 백엔드에서는 columnName으로 해당 값을 받아서 처리
        try {
            const createdCard = await createKanbanCard({
                title: newTaskTitle.value,
                cardInfo: newTaskDescription.value || '',
                columnName: selectedColumnId.value,
                boardId: boardId.value
            })

            const newCard: KanbanColumnDto = {
                columnName: selectedColumnId.value,
                orderNum: createdCard.orderNum,
                cardId: createdCard.cardId,
                title: createdCard.title,
                cardInfo: newTaskDescription.value || '',
                createdAt: createdCard.createdAt,
                updatedAt: createdCard.updatedAt,
            }

            kanbanStore.addCardToColumn(selectedColumnId.value, newCard)
            modalCheck.value = false
            newTaskTitle.value = ''
            newTaskDescription.value = ''
        } catch (error) {
            console.error('업무 추가 실패:', error)
        }
    }
    return{
        newTaskTitle,
        newTaskDescription,
        selectedColumnId,
        columns,
        boardId,
        modalCheck,
        addTask
    }


}