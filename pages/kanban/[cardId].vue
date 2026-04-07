<template>
    <div class="container-fluid detail-page-wrapper px-0">
        <div class="row g-0 justify-content-center">
            <div class="col-12 detail-page-column">
                <div class="detail-content">
                    <section class="detail-section mb-4">
                        <label class="form-label fw-medium mb-3">작업 제목</label>
                        <input type="text" class="form-control form-control-lg title-input" :value="newTaskTitle"
                            @input="updateTitle(($event.target as HTMLInputElement).value)"
                            placeholder="작업 제목을 입력하세요" />
                    </section>
                    <section class="detail-section mb-4">
                        <div class="meta-row date-row">
                            <div class="meta-field">
                                <label class="form-label fw-medium">상태</label>
                                <select class="form-select" :value="selectedColumnId"
                                    @change="updateColumnId(($event.target as HTMLSelectElement).value)">
                                    <option value="TODO">예정</option>
                                    <option value="IN_PROGRESS">진행 중</option>
                                    <option value="DONE">완료</option>
                                </select>
                            </div>
                            <div class="date-field start-date-field">
                                <div class="meta-field">
                                    <label class="form-label fw-medium">예정 시작 날짜</label>
                                    <DateInput v-model="newPredictedStartDate" />
                                </div>
                            </div>
                            <div class="date-field end-date-field">
                                <div class="meta-field">
                                    <label class="form-label fw-medium">예정 종료 날짜</label>
                                    <DateInput v-model="newPredictedEndDate" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="detail-section mb-4 section-stack">
                        <div class="info-panel">
                            <label class="form-label fw-medium mb-3">작업 구분</label>
                            <input type="text" class="form-control" :value="newClassification"
                                @input="updateClassification(($event.target as HTMLInputElement).value)"
                                placeholder="작업 구분을 입력하세요" />
                        </div>

                        <div class="info-panel description-panel mt-3">
                            <div class="description-header mb-3">
                                <label class="form-label fw-medium mb-0">작업 설명</label>
                                <span class="description-count">{{ descriptionLength }}자</span>
                            </div>
                            <textarea class="form-control description-textarea" rows="10" :value="newTaskDescription"
                                @input="updateDescription(($event.target as HTMLTextAreaElement).value)"
                                placeholder="작업 설명을 입력하세요" style="resize: vertical;" />
                        </div>
                    </section>

                    <div class="d-flex gap-2 justify-content-end flex-wrap pt-2">
                        <button class="btn btn-primary px-4" @click="$router.push('/kanban')">
                            목록으로
                        </button>
                        <button class="btn btn-primary px-4" @click="handleUpdate">
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const descriptionLength = computed(() => newTaskDescription.value.trim().length)

</script>

<style scoped>
.detail-page-wrapper {
    min-height: 100dvh;
}

.detail-page-column {
    width: 100%;
    max-width: none;
}

.detail-header {
    padding: 2rem 2rem 0;
}

.detail-content {
    width: 100%;
    min-height: 100dvh;
    padding: 10px;
    box-sizing: border-box;
}

.detail-section {
    margin-bottom: 5px !important;
}

.detail-section+.detail-section {
    padding-top: 10px;
}

.title-input {
    font-size: 1.15rem;
    font-weight: 600;
    padding-block: 0.9rem;
}

.meta-field :deep(.form-control),
.meta-field :deep(.btn),
.form-control,
.form-select {
    font-size: 1.15rem;
}

.meta-field :deep(.form-control),
.meta-field :deep(.btn),
.description-textarea,
.form-select,
.section-stack .form-control {
    font-weight: 400;
}

.meta-row {
    --bs-gutter-y: 1rem;
}

.date-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
}

.date-field {
    width: 40vw;
    max-width: 40vw;
}

.end-date-field {
    margin-left: auto;
}

.meta-field,
.info-panel {
    height: 100%;
}

.section-stack .info-panel {
    max-width: 100%;
}

.description-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.description-count {
    flex-shrink: 0;
    color: #5b6b79;
    font-size: 0.875rem;
    font-weight: 600;
    background: #eef2f6;
    border-radius: 999px;
    padding: 0.4rem 0.75rem;
}

.description-textarea {
    min-height: 50vh;
}

.form-control,
.form-select {
    border: 1.5px solid #98a2b3;
    box-shadow: none;
    border-radius: 10px;
    background-color: #fff;
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

    .date-row {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .date-field {
        width: 100%;
        max-width: 100%;
    }

    .end-date-field {
        margin-left: 0;
    }

    .detail-header {
        padding: 1.25rem 1rem 0;
    }

    .detail-content {
        min-height: 100dvh;
        padding: 10px;
    }

    .description-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>