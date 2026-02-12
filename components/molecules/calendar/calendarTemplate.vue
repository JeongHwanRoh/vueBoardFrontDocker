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
        initialView: 'dayGridMonth'
      }
    }
  }
}
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>

<style scoped>
div>.row {
  --bs-gutter-x: 30px;
  --bs-gutter-y: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex !important;
  flex-wrap: nowrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
}
</style>