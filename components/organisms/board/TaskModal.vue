<template>
    <div v-if="modalCheck" class="modal-wrap">
        <div id="draggable-modal" class="modal" :style="{ top: modalPosition?.top, left: modalPosition?.left }" @mousedown="handleMouseDown">
            <div class="modal-header" style="cursor:move; user-select:none; padding-bottom:8px;">
                <h2>업무 추가</h2>
            </div>
            <input 
                :value="newTaskTitle" 
                @input="updateTitle(($event.target as HTMLInputElement).value)" 
                placeholder="작업 제목" 
            />
            <textarea 
                :value="newTaskDescription" 
                @input="updateDescription(($event.target as HTMLTextAreaElement).value)" 
                placeholder="작업 설명"
                style="margin-top: 8px; padding: 8px; min-height: 60px; resize: vertical;"
            />
            <select 
                :value="selectedColumnId" 
                @change="updateColumnId(($event.target as HTMLSelectElement).value)"
                style="margin-top: 8px;"
            >
                <option value="todo">할 일</option>
                <option value="inProgress">진행 중</option>
                <option value="done">완료</option>
            </select>
            <div class="modal-btn">
                <button @click="handleAddTask">추가</button>
                <button @click="handleModalClose">닫기</button>
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
    selectedColumnId: 'todo'
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