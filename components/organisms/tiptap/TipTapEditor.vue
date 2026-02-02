<template>
    <div class="editor-wrapper">
        <!-- Toolbar -->
        <ToolbarBtn :editor="editor" />

        <!-- Editor -->
        <TipTapEditorContent :editor="editor" class="tiptap" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ToolbarBtn from '~/components/molecules/tiptap/ToolbarBtn.vue'
import Image from '@tiptap/extension-image'
import TipTapEditorContent from '~/components/molecules/tiptap/TipTapEditorContent.vue'


/* props */
const props = defineProps<{
  modelValue?: string
}>()

/* emits */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/* state */
const editor = ref<Editor>()

/* lifecycle */
onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit,Image],
    content: props.modelValue ?? '',
    autofocus: true,
    onUpdate: () => {
      if (!editor.value) return
      emit('update:modelValue', editor.value.getHTML())
    },
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value || value == null) return
    if (editor.value.getHTML() === value) return
    editor.value.commands.setContent(value)
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>


<style scoped>
.editor-wrapper {
    border: 1px solid #ddd;
    border-radius: 6px;
}

.toolbar {
    display: flex;
    gap: 10px;
    padding: 8px;
    background: rgba(230, 230, 234, 0.3);
    border-bottom: 1px solid #eee;
}

.toolbar button {
    padding: 4px 8px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
}

.toolbar button.active {
    background: #333;
    color: white;
    border-color: #333;
}

.tiptap {
    min-height: 300px;
    padding: 12px;
    cursor: text;
}

.tiptap :focus {
    outline: none;
}
</style>
