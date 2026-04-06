import { fetchKanbanBoardId } from "~/lib/apiService/kanbanBoardApi"
import { fetchKanbanCards } from "~/lib/apiService/kanbanCardApi"

export const fetchAllKanban = () => {
    const kanbanStore = useKanbanStore()
    kanbanStore.isLoading = true
    kanbanStore.errorMessage = null

    // 칸반보드와 카드 데이터를 모두 가져오는 함수
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