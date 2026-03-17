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
                            <select class="form-select" :value="selectedColumnName"
                                @change="updateColumnName(($event.target as HTMLSelectElement).value)">
                                <option value="TODO">예정</option>
                                <option value="IN_PROGRESS">진행 중</option>
                                <option value="DONE">완료</option>
                            </select>
                        </div>

                        <!-- 버튼 -->
                        <div class="d-flex gap-2 justify-content-end">
                            <button class="btn btn-primary" @click="$router.push('/kanban')">
                                목록으로
                            </button>
                            <button class="btn btn-primary" @click="updateCard(cardId, {
                                title: newTaskTitle,
                                cardInfo: newTaskDescription,
                                columnName: selectedColumnName

                            })">
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
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { updateCard } from '~/lib/apiService/kanbanCardApi';

const route = useRoute();
const cardId = Number(route.params.cardId);

const newTaskTitle = ref(String(history.state?.title ?? ''))
const newTaskDescription = ref(String(history.state?.cardInfo ?? ''))
const selectedColumnName = ref(String(history.state?.columnName ?? 'TODO'))

const updateTitle = (value: string) => { newTaskTitle.value = value; };
const updateDescription = (value: string) => { newTaskDescription.value = value; };
const updateColumnName = (value: string) => { selectedColumnName.value = value; };

console.log('카드 상세 페이지 - 카드 ID:', cardId)
console.log('카드 상세 페이지 - 작업 제목:', newTaskTitle.value)
console.log('카드 상세 페이지 - 작업 설명:', newTaskDescription.value)
console.log('카드 상세 페이지 - 상태:', selectedColumnName.value)

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