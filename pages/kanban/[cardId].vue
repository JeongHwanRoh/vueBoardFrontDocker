<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-12 detail-page-column">

                <!-- 헤더 -->
                <div class="d-flex align-items-center mb-4 gap-2">
                    <h4 class="mb-0 fw-semibold">카드 상세</h4>
                </div>

                <!-- 카드 영역 -->
                <div class="card shadow-sm">
                    <div class="card-body p-4">

                        <!-- 작업 제목 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">작업 제목</label>
                            <input type="text" class="form-control" :value="newTaskTitle"
                                @input="updateTitle(($event.target as HTMLInputElement).value)"
                                placeholder="작업 제목을 입력하세요" />
                        </div>

                        <!-- 작업 구분 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">작업 구분</label>
                            <input type="text" class="form-control" :value="newClassification"
                                @input="updateClassification(($event.target as HTMLInputElement).value)"
                                placeholder="작업 구분을 입력하세요" />
                        </div>

                        <!-- 작업 설명 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">작업 설명</label>
                            <textarea class="form-control" rows="4" :value="newTaskDescription"
                                @input="updateDescription(($event.target as HTMLTextAreaElement).value)"
                                placeholder="작업 설명을 입력하세요" style="resize: vertical;" />
                        </div>

                        <!-- 상태 -->
                        <div class="mb-4">
                            <label class="form-label fw-medium">상태</label>
                            <select class="form-select" :value="selectedColumnId"
                                @change="updateColumnId(($event.target as HTMLSelectElement).value)">
                                <option value="TODO">예정</option>
                                <option value="IN_PROGRESS">진행 중</option>
                                <option value="DONE">완료</option>
                            </select>
                        </div>

                        <!-- 예정 시작 날짜 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">예정 시작 날짜</label>
                            <DateInput v-model="newPredictedStartDate" />
                        </div>


                        <!-- 예정 종료 날짜 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">예정 종료 날짜</label>
                            <DateInput v-model="newPredictedEndDate" />
                        </div>

                        <!-- 버튼 -->
                        <div class="d-flex gap-2 justify-content-end">
                            <button class="btn btn-primary" @click="$router.push('/kanban')">
                                목록으로
                            </button>
                            <button class="btn btn-primary" @click="handleUpdate">
                                수정
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DateInput from '~/components/atoms/DateInput.vue'
import { useKanbanCardActions } from '~/lib/composables/kanban/useKanbanCardActions'

const route = useRoute();
const cardId = Number(route.params.cardId);
// state로 상세정보 받기 (history는 브라우저 전용이므로 onMounted에서 접근)
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newClassification = ref('')
const selectedColumnId = ref('TODO')
const orderNum = ref(0)
const boardId = ref('')
const newPredictedStartDate = ref<string>('')
const newPredictedEndDate = ref<string>('')
// 카드 업데이트 API 호출
const { handleUpdate } = useKanbanCardActions({
    cardId,
    title: newTaskTitle,
    description: newTaskDescription,
    classification: newClassification,
    columnId: selectedColumnId,
    orderNum,
    boardId,
    predictedStartDate: newPredictedStartDate,
    predictedEndDate: newPredictedEndDate,
})

onMounted(() => {
    newTaskTitle.value = String(history.state?.title ?? '')
    newTaskDescription.value = String(history.state?.cardInfo ?? '')
    newClassification.value = String(history.state?.classification ?? '')
    selectedColumnId.value = String(history.state?.columnName ?? 'TODO')
    orderNum.value = Number(history.state?.orderNum ?? 0)
    boardId.value = String(history.state?.boardId ?? '')
    newPredictedStartDate.value = String(history.state?.predictedStartDate ?? '')
    newPredictedEndDate.value = String(history.state?.predictedEndDate ?? '')
})
// 수정 후 업데이트된 정보
const updateTitle = (value: string) => { newTaskTitle.value = value; };
const updateDescription = (value: string) => { newTaskDescription.value = value; };
const updateClassification = (value: string) => { newClassification.value = value; };
const updateColumnId = (value: string) => { selectedColumnId.value = value; };

</script>

<style scoped>
.detail-page-column {
    width: min(80vw, 1100px);
}

.card {
    border: 1px solid #cfd6df;
}

.form-control,
.form-select {
    border: 1.5px solid #98a2b3;
    box-shadow: none;
}

.form-control:focus,
.form-select:focus {
    border-color: #495057;
    box-shadow: 0 0 0 0.2rem rgba(73, 80, 87, 0.12);
}

@media (max-width: 768px) {
    .detail-page-column {
        width: 100%;
    }
}
</style>