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
import ScheduleStatusTable from '~/components/molecules/kanban/ScheduleStatusTable.vue'
import type { KanbanScheduleDateKey, UpdateKanbanCardScheduleStatusRequest } from '~/lib/types/kanban'
import { updateKanbanCardScheduleStatus } from '~/lib/apiService/kanbanCardApi'

const router = useRouter()

const kanbanStore = useKanbanStore()
const { boardId, allSchedules: scheduleItems } = storeToRefs(kanbanStore)

const { fetchScheduleItems, updateScheduleDate } = useKanbanScheduleStatus()

// 상태값은 백엔드값으로부터 화면에 보여지는 값 매핑을 위해 별도 객체로 관리
const statusLabelMap = {
    TODO: '예정',
    IN_PROGRESS: '진행중',
    DONE: '완료',
} as const

const formatStatusLabel = (value: string | null | undefined) => {
    if (!value) {
        return '-'
    }

    return statusLabelMap[value as keyof typeof statusLabelMap] ?? value
}

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

const handleDateChange = ({ rowId, key, value }: { rowId: number; key: string; value: string }) => {
    if (!isScheduleDateKey(key)) {
        return
    }

    updateScheduleDate(rowId, key, value || null)
}

const saveScheduleStatus = async () => {
    const schedulePayload: UpdateKanbanCardScheduleStatusRequest = {
        schedules: scheduleItems.value.map((item) => ({
            cardId: item.cardId,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
            status: item.status,
        })),
    }

    // 화면에 표시된 전체 스케줄 상태 목록을 한 번에 저장
    try{
        await updateKanbanCardScheduleStatus(boardId.value,schedulePayload)
        alert("스케줄 상태가 성공적으로 저장되었습니다.")
    } catch (error) {
        console.error('스케줄 상태 저장 실패:', error)
        alert("스케줄 상태 저장에 실패했습니다.")
    }
    console.log('저장할 스케줄 상태 payload:', schedulePayload)
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