<template>
  <div class="
          h-full
    grid grid-flow-col auto-cols-max
    gap-10
    p-5
    overflow-x-auto
    items-start
    ">
    <div v-for="column in getBoardColumns(boardId)" :key="column.id" class="w-80 overflow-y-auto select-none"
      @drop="onDrop($event, column.id)" @dragenter.prevent @dragover.prevent>
      <div class="w-full py-4 mb-5 pl-2 bg-mauve rounded-xl">
        <p class="text-marengo">
          {{ column.name.toUpperCase() }} ({{ countTasks(column.id) }})
        </p>
      </div>
      <TransitionGroup tag="div" name="tasks" class="flex flex-col gap-5">
        <TaskCard v-for="task in getColumnTasks(boardId, column.id)" :key="task.id" :task-name="task.name" draggable
          @dragstart="startDrag($event, task, column.id)" @click="openEditForm(task, column.id)" />
      </TransitionGroup>
    </div>

    <FormColumn />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "@/stores/kanbanStore";
import { isTaskFormOpen, taskToEdit } from "@/lib/composables/kanban/modalState";
import FormColumn from "~/components/organisms/kanban/form/Column.vue";
import TaskCard from "~/components/organisms/kanban/TaskCard.vue";
import type { Task } from "@/lib/types";


const store = useKanbanStore();
const { activeBoardId } = storeToRefs(store);
const { getBoardColumns, getColumnTasks, editTask } = store;

const boardId = computed(() => activeBoardId.value!);

const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const openEditForm = (task: Task, columnId: string) => {
  isFormOpenState.value = true;
  taskToEditState.value = { ...task, columnParentId: columnId };
};

const startDrag = (e: DragEvent, task: Task, from: string) => {
  e.dataTransfer!.setData("taskId", task.id);
  e.dataTransfer!.setData("fromColumnId", from);
};

const onDrop = (e: DragEvent, to: string) => {
  const taskId = e.dataTransfer!.getData("taskId");
  const from = e.dataTransfer!.getData("fromColumnId");
  const task = getColumnTasks(boardId.value, from).find(t => t.id === taskId);
  if (task) editTask(boardId.value, from, to, task);
};

const countTasks = (columnId: string) =>
  getColumnTasks(boardId.value, columnId).length;
</script>