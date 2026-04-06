import { updateKanbanCardScheduleStatus } from "~/lib/apiService/kanbanCardApi"
import type { UpdateKanbanCardScheduleStatusRequest } from "~/lib/types/kanban"

export const useSaveKanbanScheduleStatus = () => {
    const kanbanStore = useKanbanStore()
    const { boardId, allSchedules: scheduleItems } = storeToRefs(kanbanStore)

    const saveScheduleStatus = async () => {
        const currentBoardId = boardId.value

        if (!currentBoardId) {
            console.error('boardId가 없어 스케줄 상태를 저장할 수 없습니다.')
            alert("스케줄 상태 저장에 실패했습니다.")
            return
        }

        const schedulePayload: UpdateKanbanCardScheduleStatusRequest = {
            schedules: scheduleItems.value.map((item) => ({
                cardId: item.cardId,
                actualStartDate: item.actualStartDate,
                actualEndDate: item.actualEndDate,
                status: item.status,
            })),
        }

        try {
            await updateKanbanCardScheduleStatus(currentBoardId, schedulePayload)
            alert("스케줄 상태가 성공적으로 저장되었습니다.")
        } catch (error) {
            console.error('스케줄 상태 저장 실패:', error)
            alert("스케줄 상태 저장에 실패했습니다.")
        }

        console.log('저장할 스케줄 상태 payload:', schedulePayload)
    }

    return {
        saveScheduleStatus,
    }
}
