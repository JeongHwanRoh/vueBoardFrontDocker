import { fetchKanbanBoardId } from '~/lib/apiService/kanbanBoardApi'
import type { KanbanScheduleDto } from '~/lib/types/kanban'
import { useKanbanScheduleStatus } from '~/lib/composables/kanban/useKanbanScheduleStatus'

export interface KanbanNotificationItem {
  id: string
  cardId: number
  type: 'start' | 'end'
  title: string
  message: string
}


const normalizeDateValue = (value: string | null | undefined): string | null => {
  if (!value) return ''

  const trimmedValue = String(value).trim()
  const matchedDate = trimmedValue.match(/^\d{4}-\d{2}-\d{2}/)
  return matchedDate ? matchedDate[0] : trimmedValue
}

// 오늘 날짜를 로컬 시간 기준 'YYYY-MM-DD' 형식으로 반환
const getTodayDateString = () => {
  const today = new Date()
  const timezoneOffset = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

// 알림메시지 생성 로직 (예: "업무 123 시작되었나요?", "업무 123 마무리되었나요?")
const toNotificationMessage = (schedule: KanbanScheduleDto, type: 'start' | 'end') => {
  const title = schedule.title?.trim() || `업무 #${schedule.cardId}`
  return type === 'start' ? `${title} 시작되었나요?` : `${title} 마무리되었나요?`
}

export const useKanbanNotifications = () => {
  const kanbanStore = useKanbanStore()
  const { allSchedules } = storeToRefs(kanbanStore) // pinia store에서 스케줄 데이터 가져오기
  const { fetchScheduleItems } = useKanbanScheduleStatus() // 스케줄 상태 관리 조회 함수 가져오기
  const today = computed(() => getTodayDateString())

  const notificationItems = computed<KanbanNotificationItem[]>(() => {
    return allSchedules.value.flatMap((schedule) => {
      const predictedStartDate = normalizeDateValue(schedule.predictedStartDate)
      const predictedEndDate = normalizeDateValue(schedule.predictedEndDate)
      const actualStartDate = normalizeDateValue(schedule.actualStartDate)
      const actualEndDate = normalizeDateValue(schedule.actualEndDate)
      const items: KanbanNotificationItem[] = []
      // 오늘이 예정된 시작일이고 실제 시작일이 없는 경우 -> 시작 알림
      if (predictedStartDate && predictedStartDate <= today.value && !actualStartDate) {
        items.push({
          id: `start-${schedule.cardId}-${today.value}`,
          cardId: schedule.cardId,
          type: 'start',
          title: schedule.title?.trim() || `업무 #${schedule.cardId}`,
          message: toNotificationMessage(schedule, 'start'),
        })
      }
      // 오늘이 예정된 마감일이고 실제 마감일이 없는 경우 -> 마감 알림
      if (predictedEndDate && predictedEndDate <= today.value && !actualEndDate) {
        items.push({
          id: `end-${schedule.cardId}-${today.value}`,
          cardId: schedule.cardId,
          type: 'end',
          title: schedule.title?.trim() || `업무 #${schedule.cardId}`,
          message: toNotificationMessage(schedule, 'end'),
        })
      }

      return items
    })
  })

  const hasNotifications = computed(() => notificationItems.value.length > 0)
  const notificationCardIds = computed(() => {
    return [...new Set(notificationItems.value.map((item) => item.cardId))]
  })

  const isNotificationRow = (cardId: number | string) => {
    return notificationCardIds.value.includes(Number(cardId))
  }

  const notifyUnseenItems = () => {
    if (!import.meta.client || notificationItems.value.length === 0) {
      return
    }

    const unseenMessages = notificationItems.value
      .filter((item) => !window.localStorage.getItem(`kanban-notification:${item.id}`))

    if (unseenMessages.length === 0) {
      return
    }

    window.alert(unseenMessages.map((item) => item.message).join('\n'))

    unseenMessages.forEach((item) => {
      window.localStorage.setItem(`kanban-notification:${item.id}`, item.message)
    })
  }

  const fetchNotifications = async () => {
    let targetBoardId = kanbanStore.boardId

    if (!targetBoardId) {
      const board = await fetchKanbanBoardId()
      kanbanStore.setBoard(board)
      targetBoardId = board.boardId
    }

    if (!targetBoardId) {
      return []
    }

    await fetchScheduleItems(targetBoardId)
    notifyUnseenItems()
    return notificationItems.value
  }

  return {
    notificationItems,
    hasNotifications,
    notificationCardIds,
    isNotificationRow,
    fetchNotifications,
    notifyUnseenItems,
  }
}