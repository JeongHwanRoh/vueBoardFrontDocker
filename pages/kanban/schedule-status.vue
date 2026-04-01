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
import type { KanbanScheduleDto } from '~/lib/types/kanban'

const router = useRouter()

const { scheduleItems, fetchScheduleItems } = useKanbanScheduleStatus()

const kanbanStore = useKanbanStore()
const { boardId } = storeToRefs(kanbanStore)

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

const handleDateChange = ({ rowId, key, value }: { rowId: number; key: string; value: string }) => {
    const targetRow = scheduleItems.value.find((task) => task.cardId === rowId)

    if (!targetRow) {
        return
    }

    targetRow[key as keyof KanbanScheduleDto] = value as never
}

const saveScheduleStatus = () => {
    console.log('저장 버튼 클릭 - 스케줄 저장 로직 구현 필요')
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