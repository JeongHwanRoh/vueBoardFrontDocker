<template>
    <div class="input-group">
        <input
            type="text"
            class="form-control"
            :value="modelValue"
            placeholder="YYYY-MM-DD"
            @input="onInput"
            maxlength="10"
        />
        <input
            type="date"
            ref="datePicker"
            class="hidden-date-picker"
            @change="onDateChange"
        />
        <button class="btn btn-outline-dark" type="button" @click="openPicker">
            📅
        </button>
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const datePicker = ref<HTMLInputElement | null>(null)

const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    let val = target.value.replace(/\D/g, '')
    let formatted = ''

    if (val.length <= 4) {
        formatted = val
    } else if (val.length <= 6) {
        formatted = `${val.slice(0, 4)}-${val.slice(4)}`
    } else {
        formatted = `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`
    }

    emit('update:modelValue', formatted)
}

const openPicker = () => {
    datePicker.value?.showPicker()
}

const onDateChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<style scoped>
.form-control {
    border: 1.5px solid #98a2b3;
    box-shadow: none;
}

.hidden-date-picker {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
}
</style>
