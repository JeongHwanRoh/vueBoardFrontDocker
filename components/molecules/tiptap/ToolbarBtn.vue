<template>
    <div class="toolbar">
        <button :class="{ active: editor?.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
            <strong>B</strong>
        </button>
        <button :class="{ active: editor?.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
            <i>I</i>
        </button>
        <button v-for="level in 6" :key="level"
            :class="{ active: editor?.isActive('heading', { level: level as 1 | 2 | 3 | 4 | 5 | 6 }) }"
            @click="editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()">
            h{{ level }}
        </button>
        <button class="list-btn" :class="{ active: editor?.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()">
            <div>•</div>
            <div>•</div>
            <div>•</div>
        </button>

        <button class="list-btn" :class="{ active: editor?.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()">
            <div>1</div>
            <div>2</div>
            <div>3</div>
        </button>

    </div>
</template>
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{
    editor: Editor
}>()
</script>
<style scoped>
.toolbar>button {
    border: none;
    background-color: transparent;
}

.list-btn {
    display: flex;
    flex-direction: column;
    /* ⭐ 세로 배치 핵심 */
    align-items: center;
    justify-content: center;
    gap: 2px;

    width: 32px;
    height: 32px;
    padding: 0;
}

.list-btn div {
    font-size: 10px;
    line-height: 1;
}
</style>