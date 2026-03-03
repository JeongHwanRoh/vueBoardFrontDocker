<template>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.id" class="kanban-column">
      <h3 class="column-title">{{ column.title }}</h3>
      <Draggable v-model="column.cards" group="kanban" item-key="id" class="card-list">
        <template #item="{ element }">
          <div class="kanban-card">
            <div>{{ element.title }}</div>
            <div v-if="element.startDate">시작: {{ element.startDate }}</div>
            <div v-if="element.endDate">종료: {{ element.endDate }}</div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { KanbanColumn } from '~/lib/types/kanban'
import { defineProps } from 'vue'
const props = defineProps<{ columns: KanbanColumn[] }>()
</script>
