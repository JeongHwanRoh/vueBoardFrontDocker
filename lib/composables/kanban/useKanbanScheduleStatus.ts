import { fetchKanbanCardSchedules } from "~/lib/apiService/kanbanCardApi"
import type { KanbanScheduleDto } from "~/lib/types/kanban"

export const useKanbanScheduleStatus = () => {
    const scheduleItems = ref<KanbanScheduleDto[]>([])

    const fetchScheduleItems = async (boardId: string) => {
        try {
            scheduleItems.value = await fetchKanbanCardSchedules(boardId)
        } catch (error) {
            console.error('업무 일정 조회 실패:', error)
        }
    }

    return {
        scheduleItems,
        fetchScheduleItems,
    }
}