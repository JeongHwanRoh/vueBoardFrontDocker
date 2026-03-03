<template>
    <div v-if="modalCheck" class="modal-wrap">
        <div class="modal" :id="'draggable-modal'"
            :style="modalPosition ? { top: modalPosition.top, left: modalPosition.left, position: 'fixed' } : {}">
            <div class="modal-header" @mousedown="startDrag" style="cursor:move; user-select:none; padding-bottom:8px;">
                <h2>업무 추가</h2>
            </div>
            <input :value="newTaskTitle" type="text" placeholder="업무 제목 입력"
                @input="$emit('update:newTaskTitle', ($event.target as HTMLInputElement).value)" />
            <select :value="selectedColumnId"
                @change="$emit('update:selectedColumnId', ($event.target as HTMLSelectElement).value)">
                <option value="todo">예정</option>
                <option value="inProgress">진행중</option>
                <option value="done">완료</option>
            </select>
            <div class="modal-btn">
                <button @click="addTask">추가</button>
                <button @click="modalClose">닫기</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modalCheck: boolean
    modalPosition?: { top: string; left: string }
    newTaskTitle: string
    selectedColumnId: string
    addTask: () => void
    modalClose: () => void
    startDrag: (e: MouseEvent) => void
}>()
const emit = defineEmits(['update:newTaskTitle', 'update:selectedColumnId'])
</script>
