<!-- 
설치 라이브러리
npm install --save \
  @fullcalendar/core \
  @fullcalendar/vue3

npm install @fullcalendar/daygrid'
npm install @fullcalendar/interaction'
  


-->

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        contentHeight: 'auto',
        handleWindowResize: true
      }
    }
  }
}
</script>
<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

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
}

.calendar-wrapper :deep(.fc .fc-toolbar-title) {
  font-size: 1rem;
}

.calendar-wrapper :deep(.fc .fc-button) {
  padding: 2px 8px;
  font-size: 0.78rem;
}
</style>