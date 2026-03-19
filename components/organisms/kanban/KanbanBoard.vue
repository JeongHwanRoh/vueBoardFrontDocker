<template>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.columnName" class="kanban-column-group">
      <h3 class="column-title">{{ column.columnTitle }}</h3>
      <div class="column-bar" :class="`column-bar--${column.columnName.toLowerCase()}`"></div>
      <div class="kanban-column">
        <Draggable v-model="column.cards" group="kanban" item-key="cardId" class="card-list" @end="onDragEnd">
          <template #item="{ element }">
            <div class="kanban-card">
              <div class="card-content">
                {{ element.title }}
              </div>
              <div class="card-actions">
                <button @click="$emit('editCard', element)" class="btn-edit">✏️</button>
                <button @click="$emit('deleteCard', Number(element.cardId))" class="btn-delete">🗑️</button>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { PropType } from 'vue'
import type { KanbanColumn } from '~/lib/types/kanban'
import type { ReorderCardDto } from '~/lib/types/kanban'
import { reorderCards } from '~/lib/apiService/kanbanCardApi'

const props = defineProps({
  columns: {
    type: Array as PropType<KanbanColumn[]>,
    required: true
  },
  boardId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['editCard', 'deleteCard', 'cardsReordered'])

// 드래그 종료 시 백엔드에 순서 업데이트
const onDragEnd = async () => {
  const allCards: ReorderCardDto[] = []

  props.columns.forEach(column => {
    column.cards.forEach((card, index) => {
      allCards.push({
        cardId: Number(card.cardId),
        columnName: column.columnName,
        orderNum: index,
      })
    })
  })

  try {
    await reorderCards(props.boardId, allCards)
    emit('cardsReordered')
  } catch (error) {
    console.error('카드 순서 업데이트 실패:', error)
  }
}

</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  align-items: start;
}

.kanban-column-group {
  display: flex;
  flex-direction: column;
}

.column-title {
  margin: 0 0 12px;
  text-align: center;
  font-weight: 700;
  color: #7a7a7a;
  letter-spacing: 0.04em;
}

.column-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0;
}

.column-bar--todo {
  background-color: #e05555;
}

.column-bar--in_progress {
  background-color: #3b82f6;
}

.column-bar--done {
  background-color: #4caf50;
}

.kanban-column {
  min-height: 340px;
  background: #f4f5f7;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  min-height: 100px;
  align-items: start;
}

.kanban-card {
  position: relative;
  background: linear-gradient(180deg, #f6df7b 0%, #f1d76a 100%);
  padding: 16px 14px 12px;
  border-radius: 2px;
  margin: 0;
  cursor: grab;
  box-shadow: 0 10px 18px rgba(110, 90, 20, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  max-width: 180px;
  justify-self: center;
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(182, 154, 50, 0.55);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.kanban-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 60%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card:hover {
  transform: translateY(-2px) rotate(-1deg);
  box-shadow: 0 14px 24px rgba(110, 90, 20, 0.24);
}

.card-content {
  flex: 1;
  color: #5f5f5f;
  font-weight: 700;
  line-height: 1.45;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 10px;
}

.btn-edit,
.btn-delete {
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(125, 112, 55, 0.18);
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s, background-color 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.45);
}

@media (max-width: 1200px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }

  .card-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}
</style>
