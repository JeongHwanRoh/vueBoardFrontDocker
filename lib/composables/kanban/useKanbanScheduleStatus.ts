import { fetchKanbanCardSchedules } from "~/lib/apiService/kanbanCardApi"

export const useKanbanScheduleStatus = () => {
    const kanbanStore = useKanbanStore()
    const { allSchedules: scheduleItems } = storeToRefs(kanbanStore)

    const fetchScheduleItems = async (boardId: string) => {
        kanbanStore.isLoading = true
        kanbanStore.errorMessage = null

        try {
            const schedules = await fetchKanbanCardSchedules(boardId)
            kanbanStore.setSchedules(schedules)
        } catch (error) {
            kanbanStore.errorMessage = '업무 일정 조회 실패'
            console.error('업무 일정 조회 실패:', error)
        } finally {
            kanbanStore.isLoading = false
        }
    }

    return {
        scheduleItems,
        fetchScheduleItems,
        updateScheduleDate: kanbanStore.updateScheduleDate,
    }
}