<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from '~/components/organisms/kanban/KanbanBoard.vue'
import TaskModal from '~/components/organisms/board/TaskModal.vue'
import type { Column, Card } from '~/lib/types/kanban'
import BtnBW from '~/components/atoms/BtnBW.vue'

const modalCheck = ref(false)
const newTaskTitle = ref('')
const selectedColumnId = ref('todo')

// 모달 드래그 관련 상태
const modalPosition = ref({ top: '35%', left: '50%' })
const isDragging = ref(false)
let dragOffset = { x: 0, y: 0 }

// 모달 드래그 시작
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const modal = document.getElementById('draggable-modal')
  if (modal) {
    const rect = modal.getBoundingClientRect()
    dragOffset.x = e.clientX - rect.left
    dragOffset.y = e.clientY - rect.top
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 모달 드래그 중
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  const left = e.clientX - dragOffset.x
  const top = e.clientY - dragOffset.y
  modalPosition.value.left = left + 'px'
  modalPosition.value.top = top + 'px'
}

// 모달 드래그 종료
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 초기 칸반 데이터
const columns = ref<Column[]>([
  {
    id: 'todo',
    title: '예정',
    cards: [
      { id: 1, title: '기획안 작성' },
      { id: 2, title: '요구사항 정리' }
    ]
  },
  {
    id: 'inProgress',
    title: '진행중',
    cards: [
      { id: 3, title: '프론트엔드 개발' }
    ]
  },
  {
    id: 'done',
    title: '완료',
    cards: [
      { id: 4, title: '프로젝트 세팅' }
    ]
  }
])

// 업무 추가 함수
const addTask = () => {
  debugger;
  console.log("addTask 실행")
  console.log("newTaskTitle:", newTaskTitle.value)
  if (newTaskTitle.value.trim() === '') return

  const newCard: Card = {
    id: Date.now(),
    title: newTaskTitle.value
  }

  const column = columns.value.find(col => col.id === selectedColumnId.value)
  if (column) {
    column.cards.push(newCard)
    newTaskTitle.value = ''
    modalCheck.value = false
  }
}

// 모달 열기
const modalOpen = () => {
  modalCheck.value = true
}

// 모달 닫기
const modalClose = () => {
  modalCheck.value = false
}

// 데이터 변화 감지 로직
watch(columns, (newVal) => {
  console.log('칸반 데이터 변경:', newVal)
}, { deep: true })

</script>

<template>
  <div class="addTaskBtn">
    <BtnBW field="업무 추가" @click="modalOpen"></BtnBW>
  </div>
  <!-- 업무 추가 모달 -->
  <TaskModal :modalCheck="modalCheck" :modalPosition="modalPosition" :newTaskTitle="newTaskTitle"
    :selectedColumnId="selectedColumnId" :addTask="addTask" :modalClose="modalClose" :startDrag="startDrag"
    @update:newTaskTitle="val => newTaskTitle = val" @update:selectedColumnId="val => selectedColumnId = val" />
  <!-- 칸반보드 Column -->
  <KanbanBoard :columns="columns" />
</template>

<style>
.kanban-board {
  display: flex;
  gap: 16px;
  padding: 24px 0px;
}

.kanban-column {
  width: 300px;
  background: #f4f5f7;
  border-radius: 8px;
  padding: 12px;
}

.column-title {
  font-weight: bold;
  margin-bottom: 12px;
}

.card-list {
  min-height: 100px;
}

.kanban-card {
  background: white;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.kanban-card:active {
  cursor: grabbing;
}

/* 모달 관련 css */
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 320px;
  height: 30vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* top, left는 style 바인딩으로 제어 */
}

.modal-header {
  width: 100%;
  font-weight: bold;
  cursor: move;
  user-select: none;
}

.modal-btn {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.addTaskBtn {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
</style>