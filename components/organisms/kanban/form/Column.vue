<template>
  <div
    class="
      w-80
      h-full
      min-h-[300px]
      flex flex-col items-center justify-center
      rounded-xl
      bg-gradient-to-b from-charcoal to-neutral-800
      text-lg font-bold text-neutral-300
      cursor-pointer
      hover:text-white
    "
    @click.self="isCreatingColumn = true"
  >
    + New Column

    <transition name="fade">
      <div v-if="isCreatingColumn" class="mt-6 w-full px-4 text-sm">
        <input v-model="newColumnName" @keyup.enter="createColumn" />

        <div class="flex justify-between mt-4">
          <button class="bg-savoy px-4 py-1 rounded" @click="createColumn">
            Create
          </button>
          <button @click="isCreatingColumn = false">✕</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKanbanStore } from "@/stores/kanbanStore";

const store = useKanbanStore();
const { activeBoardId } = storeToRefs(store);

const boardId = computed(() => activeBoardId.value!);
const isCreatingColumn = ref(false);
const newColumnName = ref("");

const createColumn = () => {
  if (!newColumnName.value.trim()) return;
  store.createNewColumn(boardId.value, newColumnName.value);
  newColumnName.value = "";
  isCreatingColumn.value = false;
};
</script>