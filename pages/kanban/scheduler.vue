<template>

    <schedulerTable :columns="tableColumns" :rows="tasks" idKey="cardId" @dateChange="handleDateChange" />
    <div id="button-group" class="d-flex gap-2 justify-content-end">
        <button class="btn btn-primary" @click="saveSchedule">저장</button>
        <button class="btn btn-primary" @click="goBack">돌아가기</button>
    </div>
</template>

<script setup lang="ts">

// router
import { useRouter } from 'vue-router'
import { useKanbanScheduler } from '~/lib/composables/kanban/useKanbanScheduler'
import SchedulerTable from '~/components/molecules/kanban/schedulerTable.vue'
import type { KanbanScheduleDto } from '~/lib/types/kanban'

const router = useRouter()


// 테이블 조회 API
const { tasks, fetchKanbanSchedules } = useKanbanScheduler()

const kanbanStore = useKanbanStore()
const { boardId } = storeToRefs(kanbanStore)

// 샘플 데이터 (API 연동 전용)
const tableColumns = [
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
    const targetRow = tasks.value.find((task) => task.cardId === rowId)

    if (!targetRow) {
        return
    }

    targetRow[key as keyof KanbanScheduleDto] = value as never
}

const saveSchedule = () => {
    // 저장 로직 구현 (API 호출 등)
    console.log('저장 버튼 클릭 - 스케줄 저장 로직 구현 필요')
}
const goBack = () => {
    // 돌아가기 로직 구현 (라우터 이동 등)
    router.push('/kanban')
}

onMounted(() => {
    if (boardId.value) {
        fetchKanbanSchedules(boardId.value)
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