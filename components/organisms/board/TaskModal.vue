<template>
    <div v-if="modalCheck" class="modal-wrap">
        <div id="draggable-modal" class="modal" :style="{ top: modalPosition?.top, left: modalPosition?.left }"
            @mousedown="handleMouseDown">
            <div class="modal-header" style="cursor:move; user-select:none;">
                <h4 class="mb-0 fw-semibold">업무 추가</h4>
            </div>
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

                <!-- 버튼 -->
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-primary" @click="handleAddTask">추가</button>
                    <button class="btn btn-primary" @click="handleModalClose">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
interface Props {
    modalCheck: boolean
    modalPosition?: { top: string; left: string }
    addTask?: () => void
    modalClose?: () => void
    startDrag?: (e: MouseEvent) => void
    newTaskTitle?: string
    newTaskDescription?: string
    selectedColumnId?: string
}

const props = withDefaults(defineProps<Props>(), {
    modalPosition: () => ({ top: '35%', left: '50%' }),
    newTaskTitle: '',
    newTaskDescription: '',
    selectedColumnId: 'TODO'
})

const emit = defineEmits<{
    'update:newTaskTitle': [value: string]
    'update:newTaskDescription': [value: string]
    'update:selectedColumnId': [value: string]
}>()

// 입력 값 변경 시 emit 발생
const updateTitle = (value: string) => {
    emit('update:newTaskTitle', value)
}

const updateDescription = (value: string) => {
    emit('update:newTaskDescription', value)
}

const updateColumnId = (value: string) => {
    emit('update:selectedColumnId', value)
}

const handleMouseDown = (e: MouseEvent) => {
    props.startDrag?.(e)
}

const handleAddTask = () => {
    props.addTask?.()
}

const handleModalClose = () => {
    props.modalClose?.()
}
</script>

<style scoped>
.form-control, .form-select{
    border: 1.5px solid #98a2b3;
    box-shadow: none;
}
</style>