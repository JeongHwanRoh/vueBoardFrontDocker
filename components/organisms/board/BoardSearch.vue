<template>
    <div class="board-search">
        <!-- 검색어 입력 -->
        <input v-model="localKeyword" type="text" placeholder="제목 검색..." class="search-input"
            @input="$emit('update:searchKeyword', localKeyword)" />

        <!-- 검색 결과 -->
        <!-- filteredBoards.length>0 : true  => 렌더링됨
            filteredBoards.length==0 : false => 검색어가 null, 또는 비어있는 경우 렌더링되지 않음  
        -->
        <!-- @select 이벤트: 검색 결과 중 하나를 클릭 시 발생하는 ui 이벤트 => 여기서는 상세페이지 이동 효과 -->
        <div v-if="filteredBoards.length" class="search-results">
            <ul>
                <li v-for="board in filteredBoards" :key="board.boardId">
                    <span class="result-title">
                        <a :href="`http://localhost:3000/board/detail?id=${board.boardId}`">{{ board.title }}</a>
                    </span>
                    <small> - {{ board.writerId }}</small>
                </li>
            </ul>
        </div>

        <p v-else class="no-results">검색 결과가 없습니다.</p>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

// BoardSidebar(상위 컴포넌트)에서 searchKeyword, filteredBoards 데이터 가져옴
const props = defineProps({

    searchKeyword: String,
    filteredBoards: Array,

})


// 로컬 상태(입력용)
const localKeyword = ref(props.searchKeyword || "")

// BoardSidebar(상위 컴포넌트)로 update, select 이벤트 전달
const emit = defineEmits(["update:searchKeyword", "select"])

// props 값이 외부에서 바뀌면 입력창도 동기화
watch(
    () => props.searchKeyword,
    (newVal) => {
        localKeyword.value = newVal;
        console.log("props: ", props.filteredBoards)
    }
);
</script>

<style></style>