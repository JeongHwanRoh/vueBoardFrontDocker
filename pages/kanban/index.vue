<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import type { Column, Card } from '~/lib/types/kanban'

const modalCheck = ref(false)
const newTaskTitle = ref('')
const selectedColumnId = ref('todo')

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
const addTask=() => {
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


const taskModal = () => {
  modalCheck.value = true
}
const modalClose = () => {
  modalCheck.value = false
}

// 데이터 변화 감지 로직
watch(columns, (newVal) => {
  console.log('칸반 데이터 변경:', newVal)
}, { deep: true })

</script>

<template>
  <button @click="taskModal">업무 추가</button>
  
  <div class="modal">
      <div class="modal-wrap" v-show="modalCheck">
      <h2>업무 추가</h2>
      <input v-model="newTaskTitle" type="text" placeholder="업무 제목 입력" />
      <select v-model="selectedColumnId">
        <option value="todo">예정</option>
        <option value="inProgress">진행중</option>
        <option value="done">완료</option>
      </select>
    </div>
    <div class="modal-btn">
      <button @click="addTask">추가</button>
      <button @click="modalClose">닫기</button>

    </div>
  </div>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.id" class="kanban-column">
      <h3 class="column-title">{{ column.title }}</h3>

      <Draggable v-model="column.cards" group="kanban" item-key="id" class="card-list">
        <template #item="{ element }">
          <div class="kanban-card">
            {{ element.title }}
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
  padding: 24px;
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-btn {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>