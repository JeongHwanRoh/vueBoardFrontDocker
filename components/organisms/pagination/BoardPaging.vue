<template>
    <div> 총 게시물 개수: {{ totalCount }}</div>
    <div id="pageBtn" class="d-flex gap-2 mt-4">
        <button class="btn btn-primary" @click="$emit('changePage', currentPage-1)">이전페이지</button>
        <div>{{ currentPage }} / {{ totalPages }}</div>
        <button class="btn btn-primary"  @click="$emit('changePage', currentPage+1)">다음페이지</button>
    </div>
</template>

<script setup lang="ts">

const props=defineProps({
    totalCount:{type:Number, required:true}, // 총 게시물 개수
    currentPage: {type:Number, required:true}, // 현재페이지
    totalPages: {type:Number, required:true}, // 총 페이지 수
})

defineEmits(["changePage"]);

</script>

<style scoped>
/* 페이징버튼 중앙정렬 css */
#pageBtn{

    display:flex;
    justify-content: center;
}
</style>