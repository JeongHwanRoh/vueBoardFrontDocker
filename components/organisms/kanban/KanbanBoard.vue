<template>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.id" class="kanban-column">
      <h3 class="column-title">{{ column.title }}</h3>
      <Draggable v-model="column.cards" group="kanban" item-key="id" class="card-list" @end="onDragEnd">
        <template #item="{ element }">
          <div class="kanban-card">
            <div class="card-content">
              {{ element.title }}
            </div>
            <div class="card-actions">
              <button @click="$emit('editCard', element)" class="btn-edit">✏️</button>
              <button @click="$emit('deleteCard', element.id)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { PropType } from 'vue'
import type { KanbanColumn, KanbanCard } from '~/lib/types/kanban'
import { reorderCards } from '~/lib/apiService/kanbanCardApi'

const props = defineProps({
  columns: {
    type: Array as PropType<KanbanColumn[]>,
    required: true
  }
})

const emit = defineEmits(['editCard', 'deleteCard', 'cardsReordered'])

// 드래그 종료 시 백엔드에 순서 업데이트
const onDragEnd = async () => {
  const allCards: { id: string; order: number; status: string }[] = []

  props.columns.forEach(column => {
    column.cards.forEach((card, index) => {
      allCards.push({
        id: String(card.id),
        order: index,
        status: column.status
      })
    })
  })

  try {
    await reorderCards(allCards)
    emit('cardsReordered')
  } catch (error) {
    console.error('카드 순서 업데이트 실패:', error)
  }
}

</script>

<style scoped>
.kanban-card {
  background: white;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kanban-card:active {
  cursor: grabbing;
}

.card-content {
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.btn-edit,
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 1;
}
</style>
