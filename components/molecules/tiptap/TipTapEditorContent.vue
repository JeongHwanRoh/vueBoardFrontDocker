<template>
    <div class="editor-container">
        <!-- 에디터 -->
        <EditorContent :editor="editor" />

        <!-- 에디터 내부 업로드 버튼 -->
        <div class="image-upload-overlay" @click="openFile">
            이미지 추가
        </div>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import {uploadImage} from '~/lib/apiService/boardImageApi';

const props = defineProps<{
    editor: Editor
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const openFile = () => {
    fileInput.value?.click()
}

const onFileChange = async (e: Event) => {
    debugger;
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    // 이미지 서버 업로드
    try {

        const { imageUrl } = await uploadImage(file)
        props.editor
            .chain()
            .focus()
            .setImage({ src: imageUrl })
            .run()
    } catch (error) {
        console.error("이미지 업로드 실패:", error);
    }

}
</script>

<style scoped>
.editor-container {
    position: relative;
}

.image-upload-overlay {
    position: absolute;
    bottom: 12px;
    right: 12px;
    padding: 6px 10px;
    background: #f2f2f2;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
}
</style>
