<template>
  <!-- 업무 추가 모달 -->
  <TaskModal :modalCheck="modalCheck"  :addTask="addTask"
    :modalClose="modalClose" />
  <!-- 칸반보드 + 버튼 래퍼 -->
  <div class="kanban-page-wrapper">
    <div class="routeBtn">
      <div class="schedule-management-link">
        <BtnBW field="일정 상태 관리" @click="moveToScheduleStatusPage"></BtnBW>
      </div>
      <div class="add-task-link">
        <BtnBW field="업무 추가" @click="modalOpen"></BtnBW>
      </div>
    </div>
  </div>
  <div>
    <KanbanBoardComponent :columns="columns" :boardId="boardId" @editCard="editCard" @deleteCard="deleteCard"
      @cardsReordered="loadKanbanData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { KanbanCard, KanbanColumnDto } from '~/lib/types/kanban'
import BtnBW from '~/components/atoms/BtnBW.vue'
import KanbanBoardComponent from '~/components/organisms/kanban/KanbanBoard.vue'
import TaskModal from '~/components/organisms/board/TaskModal.vue'
import { useKanbanStore } from '~/stores/kanbanStore'
import { useRouter } from 'vue-router';
import { fetchAllKanban } from '~/lib/composables/kanban/fetchAllKanban'
import { addKanbanTask } from '~/lib/composables/kanban/addKanbanTask'
import { deleteCard as deleteCardApi } from '~/lib/apiService/kanbanCardApi'
import { useKanbanCardActions } from '~/lib/composables/kanban/useKanbanCardActions'

const kanbanStore = useKanbanStore()
// 상태 변수
const router = useRouter();
// 모달 열기
const modalOpen = () => {
  modalCheck.value = true
}
// 모달 닫기
const modalClose = () => {
  modalCheck.value = false
}
// 일정 상태 관리 페이지로 이동
const moveToScheduleStatusPage = () => {
  router.push('/kanban/schedule-status')
}
// 업무 추가 (ref/store 호출은 await 전에 실행해야 컴포넌트 인스턴스 컨텍스트 유지)
const { columns, boardId, modalCheck, addTask } = addKanbanTask()
// 백엔드에서 칸반 데이터 불러오기
const { loadKanbanData } = fetchAllKanban()
// 카드 편집 및 삭제 함수
const { editCard, deleteCard } = useKanbanCardActions()

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadKanbanData()
})

// 데이터 변화 감지 로직 (칸반 카드)
watch(columns, (newVal) => {
  console.log('칸반 데이터 변경:', newVal)
}, { deep: true })

// [테스트] kanbanStore 상태 확인용
watch(() => kanbanStore.columns, (cols) => {
  console.log('[kanbanStore] boardId:', kanbanStore.boardId)
  console.log('[kanbanStore] columns:', JSON.parse(JSON.stringify(cols)))
  cols.forEach(col => {
    console.log(`[kanbanStore] ${col.columnName}(${col.columnTitle}): ${col.cards.length}건`, col.cards)
  })
}, { deep: true })

</script>
<style>
.kanban-page-wrapper {
  width: 100%;
  margin: 24px auto 0;
  padding: 0 0 20px;
  box-sizing: border-box;
}

.kanban-board {
  width: 100%;
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
  width: 400px;
  height: 500px;
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

.routeBtn {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 8px;
  gap: 10px;
  /* 버튼 사이 간격 추가 */
}

@media (max-width: 992px) {
  .kanban-page-wrapper {
    padding: 0 16px;
    overflow-x: auto;
  }

  .kanban-board {
    min-width: 320px;
  }
}
</style>