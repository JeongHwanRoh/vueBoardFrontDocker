<template>
 
  <!-- 업무 추가 모달 -->
  <TaskModal :modalCheck="modalCheck" :modalPosition="modalPosition" v-model:newTaskTitle="newTaskTitle"
    v-model:newTaskDescription="newTaskDescription" v-model:selectedColumnId="selectedColumnId" :addTask="addTask"
    :modalClose="modalClose" :startDrag="startDrag" />

  <!-- 칸반보드 Column -->
  <KanbanBoardComponent :columns="columns" @editCard="editCard" @deleteCard="deleteCard"
    @cardsReordered="loadKanbanData" />
   <div class="addTaskBtn">
    <BtnBW field="업무 추가" @click="modalOpen"></BtnBW>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { KanbanCard, KanbanColumnDto } from '~/lib/types/kanban'
import BtnBW from '~/components/atoms/BtnBW.vue'
import KanbanBoardComponent from '~/components/organisms/kanban/KanbanBoard.vue'
import TaskModal from '~/components/organisms/board/TaskModal.vue'
import { useKanbanStore } from '~/stores/kanbanStore'
import { fetchKanbanBoardId } from '~/lib/apiService/kanbanBoardApi'
import { createKanbanCard, fetchKanbanCards } from '~/lib/apiService/kanbanCardApi'


const modalCheck = ref(false)
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const selectedColumnId = ref('TODO')
const kanbanStore = useKanbanStore()
const { columns, boardId } = storeToRefs(kanbanStore)



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

// 백엔드에서 칸반 데이터 불러오기
const loadKanbanData = async () => {
  try {
    const board = await fetchKanbanBoardId()
    kanbanStore.setBoard(board)

    const cards = await fetchKanbanCards(board.boardId)
    kanbanStore.setCardsByColumn(cards)
  } catch (error) {
    console.error('칸반 데이터 로드 실패:', error)
  }
}

// 업무 추가 함수
const addTask = async () => {
  console.log("addTask 실행")
  console.log("newTaskTitle:", newTaskTitle.value)
  if (newTaskTitle.value.trim() === '') return

  if (!boardId.value) {
    console.error('boardId가 없어 업무를 추가할 수 없습니다.')
    return
  }

  try {
    const createdCard = await createKanbanCard({
      title: newTaskTitle.value,
      cardInfo: newTaskDescription.value || '',
      columnName: selectedColumnId.value,
      boardId: boardId.value
    })

    const newCard: KanbanColumnDto = {
      columnName: selectedColumnId.value,
      orderNum: createdCard.orderNum,
      cardId: createdCard.cardId,
      title: createdCard.title,
      cardInfo: newTaskDescription.value || '',
      createdAt: createdCard.createdAt,
      updatedAt: createdCard.updatedAt,
    }

    kanbanStore.addCardToColumn(selectedColumnId.value, newCard)

    newTaskTitle.value = ''
    newTaskDescription.value = ''
    modalCheck.value = false
  } catch (error) {
    console.error('업무 추가 실패:', error)
  }
}

// 카드 업데이트 함수  (백엔드 구현 시 api함수 주석 열기)
const updateCard = async (cardId: string, updates: Partial<KanbanCard>) => {
 console.log('카드 업데이트 ')
}

// 카드 편집 함수
const editCard = (card: KanbanCard) => {
  // // 편집 로직 구현 (모달 열기 등)
  console.log('카드 편집:', card)

}

// 카드 삭제 함수 (백엔드 구현 시 api함수 주석 열기)
const deleteCard = async (cardId: string) => {
  console.log('카드 삭제:', cardId)
  kanbanStore.deleteCard(Number(cardId))
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
  justify-content: flex-end;
  /* 우측정렬 */

  width: 100%;
}
</style>