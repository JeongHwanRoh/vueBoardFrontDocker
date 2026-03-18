<!-- 
 1. 게시판, 공지글 등 어떤 Input 구조에서도 재사용 가능 
 2. 신규생성, 수정 모두 활용 가능
-->

<!-- 
상위 페이지에서 컴포넌트 불러오는법
ex)
<BoardInput 
  v-model="localNotice" (v-model용 폼 명)
  titleKey="title"  (실제 entity 속성명)
  contentKey="content" (실제 entity 속성명)
  title-label="공지 제목"
  content-label="공지 내용"
/>
-->

<template>
  <div>
    <!-- 제목 -->
    <div class="mb-3">
      <label class="form-label">{{ titleLabel }}</label>
      <input v-model="localModel[titleKey]" class="form-control" :placeholder="titlePlaceholder" />
    </div>
    
    <!-- 내용 -->
    <div class="mb-3">
      <label class="form-label">{{ contentLabel }}</label>
      <!-- tiptap editor 적용 -->
      <client-only>
        <TipTapEditor v-model="localModel[contentKey]" />
      </client-only>
    </div>

  </div>
</template>

<script setup lang="ts">
import TipTapEditor from '~/components/organisms/tiptap/TipTapEditor.vue';


const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },

  /** 
   * 여러 게시판에서 key 이름이 다르기 때문에 key를 받아 재사용 가능하게 한다.
   * ex) 공지: ntitle / ncontent
   *     자유게시판: title / content
   *     QnA: question / answer
   */
  titleKey: { type: String, default: "title" },
  contentKey: { type: String, default: "content" },

  titleLabel: { type: String, default: "제목" },
  contentLabel: { type: String, default: "내용" },
  titlePlaceholder: { type: String, default: "제목 입력" },
  contentPlaceholder: { type: String, default: "내용 입력" },
});

const emit = defineEmits(["update:modelValue"]);

// props.modelValue를 그대로 반응형 객체로 감싸기
const localModel = reactive(props.modelValue);

// 부모 → 자식 동기화
watch(
  () => props.modelValue,
  (newValue) => { Object.assign(localModel, newValue) },
  { deep: true, immediate: true }
);

// 자식 → 부모 반영 (v-model 역할)
watch(
  localModel,
  (newValue) => emit("update:modelValue", newValue),
  { deep: true }
);
</script>

<style scoped>
.form-control {
  width: 100%;
  padding: 8px 0px;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--bs-body-color);
  background-color: transparent;
  border: var(--bs-border-width) solid #dbe1e6;
}

</style>
