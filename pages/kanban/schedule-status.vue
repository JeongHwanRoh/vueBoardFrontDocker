<template>

    <ScheduleStatusTable :columns="scheduleStatusColumns" :rows="scheduleItems" idKey="cardId" @dateChange="handleDateChange" />
    <div id="button-group" class="d-flex gap-2 justify-content-end">
        <button class="btn btn-primary" @click="saveScheduleStatus">저장</button>
        <button class="btn btn-primary" @click="goBack">돌아가기</button>
    </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { useKanbanScheduleStatus } from '~/lib/composables/kanban/useKanbanScheduleStatus'
import ScheduleStatusTable from '~/components/molecules/kanban/ScheduleStatusTable.vue'
import type { KanbanScheduleDateKey } from '~/lib/types/kanban'

const router = useRouter()

const kanbanStore = useKanbanStore()
console.log("kanbanStore.allSchedules:", kanbanStore.allSchedules)
const { boardId, allSchedules: scheduleItems } = storeToRefs(kanbanStore)

const { fetchScheduleItems, updateScheduleDate } = useKanbanScheduleStatus()

const scheduleStatusColumns = [
    { key: 'cardId', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'classification', label: '작업 구분' },
    { key: 'cardInfo', label: '작업 설명' },
    { key: 'predictedStartDate', label: '예정 시작일', isDate: true },
    { key: 'predictedEndDate', label: '예정 종료일', isDate: true },
    { key: 'actualStartDate', label: '실제 시작일', isDate: true },
    { key: 'actualEndDate', label: '실제 종료일', isDate: true },
    { key: 'status', label: '상태' },
];

const scheduleDateKeys: KanbanScheduleDateKey[] = [
    'predictedStartDate',
    'predictedEndDate',
    'actualStartDate',
    'actualEndDate',
]

const isScheduleDateKey = (key: string): key is KanbanScheduleDateKey => {
    return scheduleDateKeys.includes(key as KanbanScheduleDateKey)
}

const handleDateChange = ({ rowId, key, value }: { rowId: number; key: string; value: string }) => {
    if (!isScheduleDateKey(key)) {
        return
    }

    updateScheduleDate(rowId, key, value || null)
}

const saveScheduleStatus = () => {
    console.log('저장할 스케줄 상태 payload:', scheduleItems.value)
}

const goBack = () => {
    router.push('/kanban')
}

onMounted(() => {
    if (boardId.value) {
        fetchScheduleItems(boardId.value)
    }
})
</script>

<style scoped>
#button-group {
    padding-top: 30px;
}


.schedule-table-wrapper {
    max-width: 900px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
}

.schedule-table th,
.schedule-table td {
    border: 1px solid #e0e0e0;
    padding: 12px 8px;
    text-align: center;
}

.schedule-table th {
    background: #f5f7fa;
    font-weight: 600;
}
</style>