<template>
    <ScheduleStatusTable :columns="scheduleStatusColumns" :rows="scheduleItems" idKey="cardId"
        @dateChange="handleDateChange" />
    <div id="button-group" class="d-flex gap-2 justify-content-end">
        <button class="btn btn-primary" @click="saveScheduleStatus">저장</button>
        <button class="btn btn-primary" @click="goBack">돌아가기</button>
    </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { fetchKanbanBoardId } from '~/lib/apiService/kanbanBoardApi'
import { useKanbanScheduleStatus } from '~/lib/composables/kanban/useKanbanScheduleStatus'
import { useSaveKanbanScheduleStatus } from '~/lib/composables/kanban/saveKanbanScheduleStatus'
import ScheduleStatusTable from '~/components/molecules/kanban/ScheduleStatusTable.vue'
import type { KanbanScheduleDateKey } from '~/lib/types/kanban'

const router = useRouter()
const kanbanStore = useKanbanStore()
const { boardId, allSchedules: scheduleItems } = storeToRefs(kanbanStore)
const updateScheduleDate = kanbanStore.updateScheduleDate // pinia 스토어에서 스케줄 상태값 임시 업데이트 저장(프론트에서 보여줄 때 사용)

// 스케줄 상태 조회 및 업데이트 API 호출
const { fetchScheduleItems, formatStatusLabel } = useKanbanScheduleStatus()
// 스케줄 상태 저장 API 호출
const { saveScheduleStatus } = useSaveKanbanScheduleStatus()
// 스케줄 상태 테이블 컬럼 정의
const scheduleStatusColumns = [
    { key: 'cardId', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'classification', label: '작업 구분' },
    { key: 'cardInfo', label: '작업 설명' },
    { key: 'predictedStartDate', label: '예정 시작일', isDate: true },
    { key: 'predictedEndDate', label: '예정 종료일', isDate: true },
    { key: 'actualStartDate', label: '실제 시작일', isDate: true },
    { key: 'actualEndDate', label: '실제 종료일', isDate: true },
    { key: 'status', label: '상태', format: formatStatusLabel },
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

// 날짜 변경 이벤트 핸들(사용자가 날짜를 변경할 때마다 해당 카드의 스케줄 상태를 프런트상에 임시 업데이트)
const handleDateChange = ({ rowId, key, value }: { rowId: number; key: string; value: string }) => {
    if (!isScheduleDateKey(key)) {
        return
    }
    updateScheduleDate(rowId, key, value || null)
}

const goBack = () => {
    router.push('/kanban')
}

onMounted(async () => {
    // boardId가 없는 경우 보드 정보를 먼저 조회하여 스케줄 아이템을 불러올 수 있도록 함
    let targetBoardId = boardId.value

    if (!targetBoardId) {
        try {
            const board = await fetchKanbanBoardId()
            kanbanStore.setBoard(board)
            targetBoardId = board.boardId
        } catch (error) {
            console.error('칸반 보드 정보 조회 실패:', error)
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