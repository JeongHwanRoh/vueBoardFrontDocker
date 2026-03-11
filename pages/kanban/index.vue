<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { KanbanCard, KanbanColumn, KanbanColumnDto } from '~/lib/types/kanban'
import BtnBW from '~/components/atoms/BtnBW.vue'
import KanbanBoardComponent from '~/components/organisms/kanban/KanbanBoard.vue'
import { fetchKanbanCards, createKanbanCard} from '~/lib/apiService/kanbanCardApi'
import TaskModal from '~/components/organisms/board/TaskModal.vue'
import {fetchKanbanBoardId} from '~/lib/apiService/kanbanBoardApi'

const modalCheck = ref(false)
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const selectedColumnId = ref('TODO')
// const boardId='01KANBANDEFAULT00000000000' // 향후 DB에서 TB_KANBAN_BOARD에서 가져올 예정
const boardId = ref('')



// 모달 드래그 관련 상태
const modalPosition = ref({ top: '30%', left: '50%' })
const isDragging = ref(false)
let dragOffset = { x: 0, y: 0 } // 드래그 시작 시 마우스 위치와 모달의 좌상단 위치 차이 계산하는 좌표

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

// 초기 칸반 데이터
const columns = ref<KanbanColumn[]>([
  { 
    columnId:1,
    columnName: 'TODO',
    columnTitle: '예정',
    cards: []
  },
  {
    columnId:2,
    columnName: 'IN_PROGRESS',
    columnTitle: '진행중',
    cards: []
  },
  {
    columnId:3,
    columnName: 'DONE',
    columnTitle: '완료',
    cards: []
  }
])

// 백엔드에서 칸반 데이터 불러오기
const loadKanbanData = async () => {
  try {
    const newBoardId= await fetchKanbanBoardId()
    boardId.value = newBoardId.boardId
    const cards = await fetchKanbanCards(boardId.value)
    
    // 각 컬럼별로 카드 분류
    // 'todo', 'inProgress', 'done'에 따라 카드 분류 후 order 순서대로 정렬
    // status: 어떤 컬럼에 속하는가? (todo, inProgress, done 중 하나)
    // // order: 각 컬럼 내 카드의 순서 (숫자가 낮을수록 상단에 위치=>먼저 들어온 카드)
    columns.value.forEach(column => {
      column.cards = cards
        .filter(card => card.columnName === column.columnName)
        .sort((a, b) => a.orderNum - b.orderNum)
    })
  } catch (error) {
    console.error('칸반 데이터 로드 실패:', error)
  }
}

// 업무 추가 함수
const addTask = async () => {
  console.log("addTask 실행")
  console.log("newTaskTitle:", newTaskTitle.value)
  if (newTaskTitle.value.trim() === '') return

  const column = columns.value.find(col => col.columnName === selectedColumnId.value)
  if (!column) return

  try {
    const newCard = await createKanbanCard({
      title: newTaskTitle.value,
      cardInfo: newTaskDescription.value || '',
      columnName: selectedColumnId.value,
      orderNum: column.cards.length
    })

    column.cards.push({
      columnName: column.columnName,
      orderNum: newCard.orderNum,
      cardId: newCard.cardId,
      title: newCard.title,
      cardInfo: newTaskDescription.value || '',
      createdAt: newCard.createdAt,
      updatedAt: newCard.updatedAt
    })
    newTaskTitle.value = ''
    newTaskDescription.value = ''
    modalCheck.value = false
  } catch (error) {
    console.error('업무 추가 실패:', error)
  }
}

// 카드 업데이트 함수  (백엔드 구현 시 api함수 주석 열기)
const updateCard = async (cardId: string, updates: Partial<KanbanCard>) => {
  try {
    // await updateKanbanCard({ id: cardId, ...updates })
  } catch (error) {
    console.error('카드 업데이트 실패:', error)
  }
}

// 카드 편집 함수
const editCard = (card: KanbanCard) => {
  // 편집 로직 구현 (모달 열기 등)
  console.log('카드 편집:', card)
  // TODO: 편집 모달 구현
}

// 카드 삭제 함수 (백엔드 구현 시 api함수 주석 열기)
const deleteCard = async (cardId: string) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    // await deleteKanbanCard(cardId)
    // UI에서 카드 제거
    columns.value.forEach(column => {
      column.cards = column.cards.filter(card => card.cardId !== Number(cardId))
    })
  } catch (error) {
    console.error('카드 삭제 실패:', error)
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

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadKanbanData()
})

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
  <TaskModal :modalCheck="modalCheck" :modalPosition="modalPosition" v-model:newTaskTitle="newTaskTitle"
    v-model:newTaskDescription="newTaskDescription" v-model:selectedColumnId="selectedColumnId" :addTask="addTask"
    :modalClose="modalClose" :startDrag="startDrag" />

  <!-- 칸반보드 Column -->
  <KanbanBoardComponent :columns="columns" @editCard="editCard" @deleteCard="deleteCard"
    @cardsReordered="loadKanbanData" />
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