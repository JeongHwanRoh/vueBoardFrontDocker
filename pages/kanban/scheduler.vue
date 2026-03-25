<template>

    <table class="schedule-table">
        <thead>
            <tr>
                <th>업무명</th>
                <th>예정 시작일</th>
                <th>예정 종료일</th>
                <th>실제 시작일</th>
                <th>실제 종료일</th>
                <th>상태</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="task in tasks" :key="task.id">
                <td>{{ task.title }}</td>

                <!-- 예정 시작 날짜 -->
                <td>
                    <input type="date" class="form-control" :value="task.plannedStart"
                        @input="InsertStartDate(($event.target as HTMLInputElement).value)" />

                </td>
                <!-- 예정 종료 날짜 -->
                <td>
                    <input type="date" class="form-control" :value="task.plannedEnd"
                        @input="InsertEndDate(($event.target as HTMLInputElement).value)" />
                </td>
                <td>
                    <input type="date" class="form-control" :value="task.actualStart"
                        @input="InsertStartDate(($event.target as HTMLInputElement).value)" />
                </td>
                <td>
                    <input type="date" class="form-control" :value="task.actualEnd"
                        @input="InsertEndDate(($event.target as HTMLInputElement).value)" />
                </td>
                <td>{{ task.status }}</td>

            </tr>
        </tbody>
    </table>
    <div id="button-group" class="d-flex gap-2 justify-content-end">
        <button class="btn btn-primary" @click="saveSchedule">저장</button>
        <button class="btn btn-primary" @click="goBack">돌아가기</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// router
import { useRouter } from 'vue-router'
const router = useRouter()


const startDate = ref<string>(String(history.state?.startDate ?? ''))
const endDate = ref<string>(String(history.state?.endDate ?? ''))

interface Task {
    id: number
    title: string
    plannedStart: string
    plannedEnd: string
    actualStart: string
    actualEnd: string
    status: string
}

// 샘플 데이터 (API 연동 전용)
const tasks = ref<Task[]>([
    {
        id: 1,
        title: '고객사 추가 요구사항 반영 작업',
        plannedStart: '2024-03-01',
        plannedEnd: '2024-03-05',
        actualStart: '2024-03-02',
        actualEnd: '2024-03-06',
        status: '완료',
    },
    {
        id: 2,
        title: '기술코드 125 단위테스트',
        plannedStart: '2024-03-03',
        plannedEnd: '2024-03-07',
        actualStart: '2024-03-03',
        actualEnd: '',
        status: '진행 중',
    },
])


const InsertStartDate = (value: string) => {
    if (endDate.value && value > endDate.value) {
        alert('시작 날짜는 종료 날짜보다 이후일 수 없습니다.')
        return
    }
    startDate.value = value
}
const InsertEndDate = (value: string) => {
    if (startDate.value && value < startDate.value) {
        alert('종료 날짜는 시작 날짜보다 이전일 수 없습니다.')
        return
    }
    endDate.value = value
}

const saveSchedule = () => {
    // 저장 로직 구현 (API 호출 아직 미구현)
    console.log('저장된 일정', tasks.value)
}

const goBack = () => {
    // 돌아가기 로직 구현 (라우터 이동 등)
    router.push('/kanban')
}
</script>

<style scoped>
#button-group{
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