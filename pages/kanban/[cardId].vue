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
                            <input type="date" class="form-control" :value="startDate"
                                @input="UpdateStartDate(($event.target as HTMLInputElement).value)" />
                        </div>


                        <!-- 예정 종료 날짜 -->
                        <div class="mb-3">
                            <label class="form-label fw-medium">예정 종료 날짜</label>
                            <input type="date" class="form-control" :value="endDate"
                                @input="UpdateEndDate(($event.target as HTMLInputElement).value)" />
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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateCard as updateCardApi } from '~/lib/apiService/kanbanCardApi';
import { useKanbanStore } from '~/stores/kanbanStore';

const route = useRoute();
const router = useRouter();
const kanbanStore = useKanbanStore();
const cardId = Number(route.params.cardId);
// state로 상세정보 받은 
const newTaskTitle = ref(String(history.state?.title ?? ''))
const newTaskDescription = ref(String(history.state?.cardInfo ?? ''))
const selectedColumnId = ref(String(history.state?.columnName ?? 'TODO'))
const orderNum = ref(Number(history.state?.orderNum ?? 0))
const boardId = ref(String(history.state?.boardId ?? ''))
const startDate = ref<string>(String(history.state?.startDate ?? ''))
const endDate = ref<string>(String(history.state?.endDate ?? ''))
// 수정 후 업데이트된 정보
const updateTitle = (value: string) => { newTaskTitle.value = value; };
const updateDescription = (value: string) => { newTaskDescription.value = value; };
const updateColumnId = (value: string) => { selectedColumnId.value = value; };
const UpdateStartDate = (value: string) => {
  if (endDate.value && value > endDate.value) {
    alert('시작 날짜는 종료 날짜보다 이후일 수 없습니다.')
    return
  }
  startDate.value = value
}
const UpdateEndDate = (value: string) => {
  if (startDate.value && value < startDate.value) {
    alert('종료 날짜는 시작 날짜보다 이전일 수 없습니다.')
    return
  }
  endDate.value = value
}

const handleUpdate = async () => {
  const cardData = {
    cardId,
    columnName: selectedColumnId.value,
    title: newTaskTitle.value,
    orderNum: orderNum.value,
    cardInfo: newTaskDescription.value,
    startDate: startDate.value || null,
    endDate: endDate.value || null,
    boardId: boardId.value,
  }
  await updateCardApi(cardData)
  kanbanStore.updateCard(cardId, {
    columnName: cardData.columnName,
    title: cardData.title,
    orderNum: cardData.orderNum,
    cardInfo: cardData.cardInfo,
    startDate: cardData.startDate,
    endDate: cardData.endDate,
  })
  router.push('/kanban')
};

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