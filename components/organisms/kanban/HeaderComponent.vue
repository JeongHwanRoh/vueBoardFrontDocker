<template>
  <header class="flex items-center justify-between px-5 h-24 bg-charcoal">
    <!--
    보드 선택 UI 비활성화 (API 연동 후 활성화 예정)
    <select class="md:hidden" v-model="boardIdInView">
      <option v-for="board in boards" :key="board.id" :value="board.id">
        {{ board.name }}
      </option>
    </select> 
    
    -->

    <h2 class="hidden md:block">{{ boardName }}</h2>

    <div class="hidden md:flex gap-3">
      <button
        class="bg-savoy px-5 py-2 rounded-full"
        @click="openTaskForm"
      >
        + ADD TASK
      </button>
      <EllipsisVerticalIcon
        class="w-8 h-8 cursor-pointer"
        @click="editBoardFormState = true"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "@/stores/kanbanStore";
import {
  isEditBoardFormOpen,
  isTaskFormOpen,
  taskToEdit,
} from "@/lib/composables/kanban/modalState";

const store = useKanbanStore();
const { boards, activeBoardId } = storeToRefs(store);

const boardIdInView = ref(activeBoardId.value ?? "");

const boardName = computed(() => boards.value[0]?.name);

const editBoardFormState = isEditBoardFormOpen();
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const openTaskForm = () => {
  taskToEditState.value = null;
  isFormOpenState.value = true;
};



/*
보드 선택 UI 비활성화 (API 연동 후 활성화 예정)
watch(boardIdInView, () => {
   store.setActiveBoard(boardIdInView.value);
 });
 
 */
 
</script>