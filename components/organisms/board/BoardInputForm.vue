<template>
    <div class="row g-3">
        <!-- 제목/내용 입력 -->
        <BoardInput v-model="localBoard" title-key="title" content-key="content" title-label="제목"
            content-label="내용" title-placeholder="제목을 입력하세요" content-placeholder="내용을 입력하세요" />
    </div>

    <!-- 등록/목록으로 버튼 -->
    <div id="resultBtn" class="gap-2">
        <button id="submitBtn" @click="emit('submit', localBoard)" class="btn btn-primary">
            제출하기
        </button>
        <button id="goBackBtn" class="btn btn-primary" @click="emit('cancel')">
            목록으로
        </button>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import BoardInput from "@/components/molecules/table/BoardInput.vue";
import type { BoardCreateRequest } from "~/lib/types/board";


// 렌더링 전 props 기본값을 지정하기
// 부모에서 board 객체가 넘어오기 전 빈 객체가 먼저 렌더링되어
// undefined 접근 에러가 사라짐(초기 렌더링 안전장치 역할)
// defineProps 타입 선언
const props = defineProps<{
    board?: BoardCreateRequest;
    isUpdate: boolean;
    isSubmit: boolean;

}>();

const emit = defineEmits({
    submit: (payload: BoardCreateRequest) => true,
    cancel: () => true,
    handleFileChange: (event: Event) => true,
});

// props 로컬 복사본: 렌더링 후 부모 데이터가 실제 넘어왔을 때, 해당 데이터를 로컬에서 수정 가능한 형태로 저장하는 역할
// v-model은 props에 직접 연결할 수 없으므로 로컬 복사본을 만들어야 함
const localBoard = reactive<BoardCreateRequest>({
    title: '',
    writer: '',
    pn: 0,
    content: '',
    regdate: new Date(),

})

// 부모 board 변경 시 동기화
watch(
    () => props.board,
    (newVal) => {
        if (newVal) Object.assign(localBoard, newVal)
    },
    { immediate: true }
)



</script>

<style scoped>
#resultBtn {
    padding: 50px;
    display: flex;
    justify-content: center;
}

</style>