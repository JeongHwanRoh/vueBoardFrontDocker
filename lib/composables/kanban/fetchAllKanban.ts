import { fetchKanbanBoardId } from "~/lib/apiService/kanbanBoardApi"
import { fetchKanbanCards } from "~/lib/apiService/kanbanCardApi"

export const fetchAllKanban = () => {
    const kanbanStore = useKanbanStore()
    kanbanStore.isLoading = true
    kanbanStore.errorMessage = null


    const loadKanbanData = async () => {
        try {
            const board = await fetchKanbanBoardId()
            kanbanStore.setBoard(board)

            const cards = await fetchKanbanCards(board.boardId)
            kanbanStore.setCardsByColumn(cards)
        } catch (error) {
            console.error('칸반 데이터 로드 실패:', error)
        }
    }

    return { loadKanbanData }

}