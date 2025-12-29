<template>
  <div class="pagination">
    <button
      @click="$emit('change', currentPage - 1)"
      :disabled="currentPage === 1"
    >
      이전
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="$emit('change', page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>

    <button
      @click="$emit('change', currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      다음
    </button>
  </div>
</template>

<script setup>

import {defineProps, defineEmits} from 'vue';
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

defineEmits(["change"]);
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}

.pagination button {
  background-color: #eee;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
