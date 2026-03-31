<template>
    <div class="input-group">
        <input
            type="text"
            class="form-control"
            :value="normalizedValue"
            placeholder="YYYY-MM-DD"
            @input="onInput"
            maxlength="10"
        />
        <input
            type="date"
            ref="datePicker"
            class="hidden-date-picker"
            :value="normalizedValue"
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

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const datePicker = ref<HTMLInputElement | null>(null)


/* 
텍스트 input 표시값을 normalizedValue로 사용
숨겨진 type="date" input도 같은 normalizedValue 사용
2026-04-10 00:00:00 같은 값이 들어오면 자동으로 2026-04-10으로 잘려서 표시됨
직접 입력할 때도 기존처럼 yyyy-mm-dd 형식으로 유지됨 
*/
const normalizeDateValue = (value: string | null | undefined) => {
    if (!value) return ''

    const trimmed = String(value).trim()
    const matchedDate = trimmed.match(/^\d{4}-\d{2}-\d{2}/)

    if (matchedDate) {
        return matchedDate[0]
    }

    const digits = trimmed.replace(/\D/g, '').slice(0, 8)

    if (digits.length <= 4) {
        return digits
    }

    if (digits.length <= 6) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`
    }

    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
}

const normalizedValue = computed(() => normalizeDateValue(props.modelValue))

const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', normalizeDateValue(target.value))
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
