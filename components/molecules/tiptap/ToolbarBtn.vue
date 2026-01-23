<template>
    <div class="toolbar">
        <button :class="{ active: editor?.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
            Bold
        </button>
        <button :class="{ active: editor?.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
            Italic
        </button>
        <button v-for="level in 6" :key="level" :class="{ active: editor?.isActive('heading', { level: level as 1 | 2 | 3 | 4 | 5 | 6 }) }"
            @click="editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()">
            H{{ level }}
        </button>
        <button :class="{ active: editor?.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()">
            • List
        </button>
        <button :class="{ active: editor?.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()">
            1. List
        </button>
    </div>
</template>
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{
    editor: Editor
}>()
</script>