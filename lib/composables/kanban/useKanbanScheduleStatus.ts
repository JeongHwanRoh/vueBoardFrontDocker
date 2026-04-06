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
    // 상태값은 백엔드값으로부터 화면에 보여지는 값 매핑을 위해 별도 객체로 관리
    const statusLabelMap = {
        TODO: '예정',
        IN_PROGRESS: '진행중',
        DONE: '완료',
    } as const

    // 상태값을 화면에 보여지는 값으로 변환하는 함수
    const formatStatusLabel = (value: string | null | undefined) => {
        if (!value) {
            return '-'
        }
        return (statusLabelMap as Record<string, string>)[value] ?? value
    }
    return {
        scheduleItems,
        fetchScheduleItems,
        formatStatusLabel,

    }
}