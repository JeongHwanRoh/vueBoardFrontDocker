<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput } from '@fullcalendar/core'
import { fetchKanbanBoardId } from '~/lib/apiService/kanbanBoardApi'
import type { KanbanScheduleDto, KanbanScheduleStatus } from '~/lib/types/kanban'
import { useKanbanScheduleStatus } from '~/lib/composables/kanban/useKanbanScheduleStatus'

const kanbanStore = useKanbanStore()
const { boardId, allSchedules } = storeToRefs(kanbanStore)
const { fetchScheduleItems } = useKanbanScheduleStatus()
// 캘린더 이벤트에 적용할 상태별 CSS 클래스 매핑
const statusClassMap: Record<KanbanScheduleStatus, string> = {
  TODO: 'calendar-event--todo',
  IN_PROGRESS: 'calendar-event--in-progress',
  DONE: 'calendar-event--done',
}

// 종료 날짜에 하루를 더하는 함수 
// FullCalendar에서 종료 날짜는 비포함이므로, 사용자가 입력한 종료 날짜에 하루를 더해서 이벤트가 해당 날짜까지 표시되도록 함
// padStart: 날짜가 한 자리인 경우 앞에 0을 붙여서 두 자리로 만들어주는 함수 (예: 2024-6-5 -> 2024-06-05)
const addOneDay = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + 1)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') 
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// KanbanScheduleDto를 FullCalendar의 EventInput으로 변환하는 함수
const toCalendarEvent = (schedule: KanbanScheduleDto): EventInput | null => {
  const startDate = schedule.predictedStartDate // 시작 날짜
  const endDate = schedule.predictedEndDate // 종료 날짜

  if (!startDate || !endDate) {
    return null
  }

  const status = schedule.status ?? 'TODO'
  const title = schedule.title?.trim() ?? ''

  return {
    id: String(schedule.cardId), //cardId를 문자열로 변환하여 이벤트 ID로 사용
    title, // 카드 제목 (예: "작업 제목")
    start: startDate,
    end: addOneDay(endDate), // 종료 날짜에 하루를 더해서 이벤트가 해당 날짜까지 표시되도록 함
    allDay: true, // 종일 이벤트로 설정
    classNames: [statusClassMap[status]], //statusClassMap['TODO'], statusClassMap['IN_PROGRESS'], statusClassMap['DONE'] 중 하나의 CSS 클래스 적용
    extendedProps: {  // event.extendedProps.status, event.extendedProps.classification 등으로 접근 가능
      status,
      classification: schedule.classification ?? '',
    },
  }
}

// allSchedules(piniaStore에서 가져온 값) 배열을 FullCalendar에서 사용할 이벤트 배열로 변환
const calendarEvents = computed(() =>
  allSchedules.value
    .map(toCalendarEvent)
    .filter((event): event is EventInput => event !== null)
)

// 캘린더 옵션 설정
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin], // 월간 달력 표시 기능 및 상호작용 기능 활성화
  initialView: 'dayGridMonth', // 초기 뷰를 월간 달력으로 설정
  contentHeight: 'auto', // 캘린더 높이를 콘텐츠에 맞게 자동 조절
  handleWindowResize: true, // 창 크기 변경 시 캘린더 크기도 자동으로 조절
  fixedWeekCount: false, // 월별로 실제 주 수에 따라 달력 높이 조절 (기본값은 true로, 항상 6주를 표시)
  dayMaxEventRows: 3, // 하루에 표시할 최대 이벤트 수
  displayEventTime: false, // 이벤트 시간 표시 여부
  events: calendarEvents.value, // computed된 이벤트 배열을 캘린더에 전달
  eventDisplay: 'block' as const, // 이벤트를 블록 형태로 표시
  eventOrder: 'start,-duration,title', // 이벤트 정렬 순서 설정
  headerToolbar: { // 캘린더 상단 툴바 설정
    left: 'prev,next',
    center: 'title',
    right: '',
  }, 
  buttonText: { // 툴바 버튼 텍스트 설정
    prev: '◀',
    next: '▶',
  },
}))

onMounted(async () => {
  let targetBoardId = boardId.value
  // 새로고침시 boardId가 없는 경우 보드 정보를 먼저 조회하여 스케줄 아이템을 불러올 수 있도록 함
  if (!targetBoardId) {
    try {
      const board = await fetchKanbanBoardId()
      kanbanStore.setBoard(board)
      targetBoardId = board.boardId
    } catch (error) {
      console.error('캘린더용 칸반 보드 정보 조회 실패:', error)
      return
    }
  }
  // boardId가 확보된 이후에 상태 조회 API 호출
  if (targetBoardId) {
    await fetchScheduleItems(targetBoardId)
  }
})
</script>


<style scoped>
.calendar-wrapper {
  width: 100%;
  overflow: visible;
}

.calendar-wrapper :deep(.fc) {
  font-size: 0.82rem;
}

.calendar-wrapper :deep(.fc .fc-toolbar) {
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.calendar-wrapper :deep(.fc .fc-toolbar-title) {
  font-size: 1rem;
  font-weight: 700;
}

.calendar-wrapper :deep(.fc .fc-button) {
  padding: 2px 8px;
  font-size: 0.78rem;
}

.calendar-wrapper :deep(.fc .fc-daygrid-day-frame) {
  min-height: 88px;
}

.calendar-wrapper :deep(.fc .fc-daygrid-day-number) {
  font-weight: 600;
  color: #444;
}

.calendar-wrapper :deep(.fc .fc-daygrid-event) {
  border: none;
  border-radius: 999px;
  margin-top: 4px;
  padding: 0;
  box-shadow: none;
}

.calendar-wrapper :deep(.fc .fc-event-main) {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.3;
  color: #fff;
}

.calendar-wrapper :deep(.fc .fc-daygrid-event-dot) {
  display: none;
}
/* 상태별 이벤트 색상 설정 */
.calendar-wrapper :deep(.calendar-event--todo .fc-event-main) {
  background: #e05555;
}

.calendar-wrapper :deep(.calendar-event--in-progress .fc-event-main) {
  background: #3b82f6;
}

.calendar-wrapper :deep(.calendar-event--done .fc-event-main) {
  background: #4caf50;
}
</style>