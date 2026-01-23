<template>
  <div class="page-wrapper">
    <client-only>
      <TiptapEditor v-model="content" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from '~/components/organisms/tiptap/TipTapEditor.vue'

const content = ref('')
</script>

<style scoped>
.page-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.debug {
  margin-top: 24px;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
}
</style>
