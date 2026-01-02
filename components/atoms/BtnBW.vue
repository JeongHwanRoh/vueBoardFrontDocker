<script setup lang="ts">
    const props = defineProps<{
    field: string,
    type?: 'button' | 'submit' | 'reset'
}>();

const emit = defineEmits<{
  (e: 'click'): void
}>();

// 상위 페이지 사용 시 
//<btn-b-w field="저장" @click="handleSave"></btn-b-w>
</script>

<template>
    <div class="button-container">
        <button :type="props.type || 'submit'" v-bind="$attrs" class="submit-btn" @click="emit('click')">
            {{props.field}}
        </button>
    </div>
</template>

<style scoped>
.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}

.submit-btn {
    background-color: #1b2f63;
    color: white;
    border: 1px solid #1b2f63;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
}

.submit-btn:hover {
    background-color: #15244b;
}
</style>


