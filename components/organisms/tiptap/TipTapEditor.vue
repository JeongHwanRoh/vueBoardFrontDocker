<template>
    <div class="editor-wrapper">
        <!-- Toolbar -->
        <ToolbarBtn :editor="editor" />

        <!-- Editor -->
        <editor-content class="tiptap" :editor="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ToolbarBtn from '~/components/molecules/tiptap/ToolbarBtn.vue'

export default {
    components: { EditorContent, ToolbarBtn },

    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            editor: null,
        }
    },

    mounted() {
        this.editor = new Editor({
            extensions: [StarterKit],
            content: this.modelValue,
            autofocus: true,
            onUpdate: () => {
                this.$emit('update:modelValue', this.editor.getHTML())
            },
        })
    },

    watch: {
        modelValue(value) {
            if (!this.editor) return
            if (this.editor.getHTML() === value) return
            this.editor.commands.setContent(value)
        },
    },

    beforeUnmount() {
        this.editor?.destroy()
    },
}
</script>

<style scoped>
.editor-wrapper {
    border: 1px solid #ddd;
    border-radius: 6px;
}

.toolbar {
    display: flex;
    gap: 6px;
    padding: 8px;
    background: #fafafa;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    z-index: 10;
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
