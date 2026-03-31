import { fetchKanbanCardSchedules } from "~/lib/apiService/kanbanCardApi"
import type { KanbanScheduleDto } from "~/lib/types/kanban"

export const useKanbanScheduler = () => {
    const tasks = ref<KanbanScheduleDto[]>([])
    // 칸반카드(업무) 리스트 조회 API
    const fetchKanbanSchedules = async (boardId: string) => {
        try {
            tasks.value = await fetchKanbanCardSchedules(boardId)
        } catch (error) {
            console.error('업무 일정 조회 실패:', error)
        }
    }

    return {
        tasks,
        fetchKanbanSchedules,
    }
}