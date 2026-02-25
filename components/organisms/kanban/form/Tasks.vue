<template>
  <transition name="fade">
    <div v-if="isFormOpenState" class="popup-modal">
      <div
        class="w-96 lg:w-1/3 h-4/5 flex flex-col p-8 bg-charcoal rounded-xl gap-10 relative m-10"
      >
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 rounded-full bg-mauve p-3"
          @click="toggleFormModal(false)"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2>{{ taskToEditState ? "Edit" : "Add" }} Task</h2>

        <div class="w-full h-full space-y-10 pr-8 flex flex-col">
          <div class="flex flex-col space-y-2">
            <label>Title</label>
            <input v-model.trim="taskName" />
          </div>

          <div class="flex flex-col space-y-2 h-full">
            <label>Description</label>
            <textarea v-model.trim="taskDescription" class="h-full" />
          </div>

          <div class="space-y-2">
            <label>Status</label>
            <select v-model="taskColumnId">
              <option
                v-for="column in getBoardColumns(boardId)"
                :key="column.id"
                :value="column.id"
              >
                {{ column.name }}
              </option>
            </select>
          </div>
        </div>

        <BaseButton
          :label="buttonLabel"
          class="bg-savoy"
          @action="taskToEditState ? editTaskInfos() : createNewTask()"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "@/stores/kanbanStore";
import { isTaskFormOpen, taskToEdit } from "@/lib/composables/kanban/modalState";
import useValidator from "~/utils/useValidator";

const store = useKanbanStore();
const { activeBoardId } = storeToRefs(store);
const { addTaskToColumn, getBoardColumns, editTask } = store;

const boardId = computed(() => activeBoardId.value!);

const isFormOpenState = isTaskFormOpen();
const taskToEditState = taskToEdit();

const taskColumnId = ref("");
const taskName = ref("");
const taskDescription = ref("");

const toggleFormModal = (open: boolean) => {
  isFormOpenState.value = open;
  taskToEditState.value = null;
};

const resetValues = () => {
  const columns = getBoardColumns(boardId.value);
  taskColumnId.value = columns[0]?.id ?? "";
  taskName.value = "";
  taskDescription.value = "";
};

const createNewTask = () => {
  if (useValidator(taskName.value, taskDescription.value)) {
    addTaskToColumn(boardId.value, taskColumnId.value, {
      name: taskName.value,
      description: taskDescription.value,
    });
    resetValues();
    toggleFormModal(false);
  }
};

const editTaskInfos = () => {
  if (!taskToEditState.value) return;
  editTask(
    boardId.value,
    taskToEditState.value.columnParentId,
    taskColumnId.value,
    {
      id: taskToEditState.value.id,
      name: taskName.value,
      description: taskDescription.value,
    }
  );
  resetValues();
  toggleFormModal(false);
};

const buttonLabel = computed(() =>
  taskToEditState.value ? "Save Changes" : "Add Task"
);

watch(isFormOpenState, () => {
  if (taskToEditState.value) {
    taskName.value = taskToEditState.value.name;
    taskDescription.value = taskToEditState.value.description;
    taskColumnId.value = taskToEditState.value.columnParentId;
  } else {
    resetValues();
  }
});
</script>