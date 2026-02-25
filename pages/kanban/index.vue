<template>
  <section class="h-screen flex flex-col w-full overflow-hidden">
    <!-- Board Header -->
    <header
      class="h-20 shrink-0 flex items-center justify-between px-6 bg-charcoal">
      <button
        class="bg-savoy px-6 py-2 rounded-full font-semibold"
        @click="openTaskForm"
      >
        + ADD TASK
      </button>
    </header>

    <!-- Kanban Body -->
    <main class=" overflow-hidden">
      <Columns />
    </main>

    <!-- Modals -->
    <Tasks />
    <EditBoard />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useKanbanStore } from "@/stores/kanbanStore";

import Columns from "~/components/organisms/kanban/Columns.vue";
import Tasks from "~/components/organisms/kanban/form/Tasks.vue";
import EditBoard from "~/components/organisms/kanban/form/EditBoard.vue";
import { isTaskFormOpen, taskToEdit } from "~/lib/composables/kanban/modalState";

const store = useKanbanStore();
const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const openTaskForm = () => {
  taskToEditState.value = null;
  isFormOpenState.value = true;
};

onMounted(() => {
  store.initUIBoard();
});
</script>