import { fetchKanbanBoardId } from "~/lib/apiService/kanbanBoardApi"
import { fetchKanbanCards } from "~/lib/apiService/kanbanCardApi"

export const fetchAllKanban = () => {
    const kanbanStore = useKanbanStore()
    kanbanStore.isLoading = true
    kanbanStore.errorMessage = null

    // 칸반보드와 카드 데이터를 모두 가져오는 함수
    const loadKanbanData = async () => {
        try {
            const board = await fetchKanbanBoardId() // boardId 조회 API 호출
            kanbanStore.setBoard(board) // 조회한 board 정보 PINIA 스토어에 저장
            const cards = await fetchKanbanCards(board.boardId) // boardId로 카드 목록 조회 API 호출
            kanbanStore.setCardsByColumn(cards)
        } catch (error) {
            console.error('칸반 데이터 로드 실패:', error)
        }
    }
    return { loadKanbanData }

}