<template>
  <transition name="fade">
    <div v-if="boardFormState" class="popup-modal">
      <div class="w-fit p-8 bg-charcoal rounded-xl relative">
        <button
          class="absolute right-0 translate-x-4 -translate-y-5 top-0 bg-mauve p-3 rounded-full"
          @click="boardFormState = false"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>

        <h2>Edit Board</h2>

        <div class="mt-5 space-y-4">
          <input v-model="boardName" />

          <div v-for="column in boardColumns" :key="column.id" class="flex gap-2">
            <input v-model="column.name" class="flex-1" />
            <TrashIcon
              class="w-6 h-6 cursor-pointer"
              @click="removeColumn(column.id)"
            />
          </div>
        </div>

        <div class="mt-10 flex flex-col gap-3">
          <ButtonBase label="Save" class="bg-green-600" @action="saveChanges" />
          <ButtonBase label="Delete" class="bg-savoy" @action="removeBoard" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XMarkIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useKanbanStore } from "@/stores/kanbanStore";
import { isEditBoardFormOpen } from "@/lib/composables/kanban/modalState";
import useValidator from "~/utils/useValidator";
import type { Column } from "@/lib/types";

const store = useKanbanStore();
const { activeBoardId, boards } = storeToRefs(store);
const { editBoard, getBoardColumns, deleteBoard } = store;

const boardFormState = isEditBoardFormOpen();
const boardId = computed(() => activeBoardId.value!);

const boardName = ref("");
const boardColumns = ref<Column[]>([]);

const saveChanges = () => {
  if (useValidator(boardName.value)) {
    editBoard(boardId.value, boardName.value, boardColumns.value);
    boardFormState.value = false;
  }
};

const removeColumn = (id: string) => {
  boardColumns.value = boardColumns.value.filter(c => c.id !== id);
};

const removeBoard = () => {
  deleteBoard(boardId.value);
  boardFormState.value = false;
};

watch(boardFormState, open => {
  if (open) {
    boardName.value =
      boards.value.find(b => b.id === boardId.value)?.name ?? "";
    boardColumns.value = JSON.parse(
      JSON.stringify(getBoardColumns(boardId.value))
    );
  }
});
</script>