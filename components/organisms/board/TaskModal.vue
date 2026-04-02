<template>
    <div v-if="modalCheck" class="modal-wrap">
        <div id="draggable-modal" class="modal" :style="{ top: modalPosition?.top, left: modalPosition?.left }">
            <div class="modal-header" style="cursor:move; user-select:none;" @mousedown="handleMouseDown">
                <h4 class="mb-0 fw-semibold">업무 추가</h4>
            </div>
            <div class="card-body p-4">
                <!-- 작업 제목 -->
                <div class="mb-3">
                    <label class="form-label fw-medium">작업 제목</label>
                    <input type="text" class="form-control" v-model="localTitle" placeholder="작업 제목을 입력하세요" />
                </div>

                <!-- 작업 구분 -->
                <div class="mb-3">
                    <label class="form-label fw-medium">작업 구분</label>
                    <input type="text" class="form-control" v-model="localClassification" placeholder="작업 구분을 입력하세요" />
                </div>

                <!-- 작업 설명 -->
                <div class="mb-3">
                    <label class="form-label fw-medium">작업 설명</label>
                    <textarea class="form-control" rows="4" v-model="localDescription" placeholder="작업 설명을 입력하세요"
                        style="resize: vertical;" />
                </div>

                <!-- 상태 -->
                <div class="mb-4">
                    <label class="form-label fw-medium">상태</label>
                    <select class="form-select" v-model="localColumnId">
                        <option value="TODO">예정</option>
                        <option value="IN_PROGRESS" disabled>진행 중</option>
                        <option value="DONE" disabled>완료</option>
                    </select>
                </div>

                <!-- 버튼 -->
                <!-- 예정 시작 날짜 -->
                <div class="mb-3">
                    <label class="form-label fw-medium">예정 시작 날짜</label>
                    <DateInput v-model="localStartDate" />
                </div>
                <!-- 예정 종료 날짜 -->
                <div class="mb-3">
                    <label class="form-label fw-medium">예정 종료 날짜</label>
                    <DateInput v-model="localEndDate" />
                </div>

                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-primary" @click="handleAddTask">추가</button>
                    <button class="btn btn-primary" @click="handleModalClose">닫기</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { TaskFormData } from '~/lib/composables/kanban/addKanbanTask'
import DateInput from '~/components/atoms/DateInput.vue'

interface Props {
    modalCheck: boolean
    modalPosition?: { top: string; left: string }
    addTask?: (data: TaskFormData) => void
    modalClose?: () => void

}

const props = withDefaults(defineProps<Props>(), {
    modalPosition: () => ({ top: '35%', left: '50%' }),
})

// 로컬 상태 - 부모 props에 의존하지 않음
const localTitle = ref('')
const localClassification = ref('')
const localDescription = ref('')
const localColumnId = ref('TODO')
const localStartDate = ref('')
const localEndDate = ref('')
// 모달 드래그 관련 상태
const modalPosition = ref({ top: '30%', left: '50%' })
const isDragging = ref(false)
let dragOffset = { x: 0, y: 0 } // 드래그 시작 시 마우스 위치와 모달의 좌상단 위치 차이 계산하는 좌표
// 모달이 닫힐 때 로컬 상태 초기화
watch(() => props.modalCheck, (isOpen) => {
    if (!isOpen) {
        localTitle.value = ''
        localClassification.value = ''
        localDescription.value = ''
        localColumnId.value = 'TODO'
        localStartDate.value = ''
        localEndDate.value = ''
    }
})

// 모달 드래그 시작
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const modal = document.getElementById('draggable-modal')
  if (modal) {
    const rect = modal.getBoundingClientRect()
    // dragOffset: 마우스 위치와 모달의 좌상단 위치 차이 계산
    // 드래그 시작 때 계산
    dragOffset.x = e.clientX - rect.left // 마우스 x좌표에서 모달의 좌상단 x좌표를 빼서 dragOffset.x 계산
    dragOffset.y = e.clientY - rect.top // 마우스 y좌표에서 모달의 좌상단 y좌표를 빼서 dragOffset.y 계산
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 모달 드래그 중
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  // 드래그 중 위치 계산
  const left = e.clientX - dragOffset.x  // x좌표에서 dragOffset.x를 빼서 모달의 좌상단이 마우스 위치에 오도록 계산
  const top = e.clientY - dragOffset.y  // y좌표에서 dragOffset.y를 빼서 모달의 좌상단이 마우스 위치에 오도록 계산
  modalPosition.value.left = left + 'px' // 계산된 left값을 모달 위치에 적용
  modalPosition.value.top = top + 'px'  // 계산된 top값을 모달 위치에 적용
  console.log('드래그 중 - left:', left, 'top:', top)
}

// 모달 드래그 종료
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 드래그 시작
const handleMouseDown = (e: MouseEvent) => {
    startDrag(e)
}

// TaskModal -> index.vue -> addKanbanTask() 통해 칸반보드 컴포넌트로 업무 추가 요청
// 요청에 필요한 데이터 준비 후 부모페이지(index.vue)의 addTask() 호출
const handleAddTask = () => {
    if (localStartDate.value > localEndDate.value) {
        alert('시작 날짜는 종료 날짜보다 이후일 수 없습니다.')
        return
    }
    props.addTask?.({
        title: localTitle.value,
        classification: localClassification.value,
        description: localDescription.value,
        columnId: localColumnId.value,
        startDate: localStartDate.value,
        endDate: localEndDate.value,
    })
}

const handleModalClose = () => {
    props.modalClose?.()
}
</script>

<style scoped>
.form-control,
.form-select {
    border: 1.5px solid #98a2b3;
    box-shadow: none;
}

/* 비활성화된 옵션 스타일(상태옵션) */
.form-select option:disabled {
    color: #ccc; /* 옅은 회색 코드 */
    background-color: #f9f9f9; /* 배경색도 살짝 밝게 가능 */
}
</style>