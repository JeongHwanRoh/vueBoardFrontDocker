<template>
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

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { PropType } from 'vue'

interface Card {
  id: string | number
  title: string
}

interface Column {
  id: string | number
  title: string
  cards: Card[]
}

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true
  }
})


</script>
