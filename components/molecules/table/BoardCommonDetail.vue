<!-- 
1. 상단에 제목(굵게), 작성자, 작성일, 조회수가 띄워지고 하단에 내용 조회 가능
2. 게시판, 공지글 등 어떤 상세보기 구조에서도 재사용 가능

-->

<!-- 
상위 페이지에서 컴포넌트 불러오는법
ex)
    <BoardDetail
      :item="props.[엔터티명]"
      titleKey="[title 속성명]"
      writerKey="[writer 속성명]"
      dateKey="[날짜 관련 속성명]"
      viewKey="[조회수 관련 속성명]"
      contentKey="[내용 관련 속성명]"
      :formatter="props.formatter"
    />

NoticeDetail.vue, [noticeId].vue 참고
-->

<template>
    <!-- 제목, 작성자, 작성일, 조회수 부분 -->
    <div id="title-userinfo" class="mb-3">
        <h4 class="board-title">
            <span>{{ item?.[titleKey] }}</span>
        </h4>
        <div class="userinfo">
            <span v-if="writerKey">작성자: {{ item?.[writerKey] }}</span>
            <span v-if="dateKey">
                작성일: {{ formatter?.(item?.[dateKey]) }}
            </span>
            <span v-if="viewKey">
                조회수: {{ item?.[viewKey] }}
            </span>
        </div>
    </div>
    <!-- 내용 부분 -->
    <div class="mb-3">
        <textarea class="form-control" rows="20" readonly>{{ item?.[contentKey] }}</textarea>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    // 공지, 자유게시판 등 어떤 데이터든 가능
    item: {
        type: Object as PropType<Record<string, any> | null>,
        required: true
    },        
    titleKey: { type: String, default: "title" },  // 제목 필드명
    writerKey: { type: String, default: "writer" },
    dateKey: { type: String, default: "regdate" },
    viewKey: { type: String, default: "viewcnt" },
    contentKey: { type: String, default: "content" },

    // 날짜 포맷터 함수 (상위에서 주입)
    formatter: {
        type: Function,
        default: (val: any) => val
    }
});
</script>

<style scoped>
#title-userinfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.userinfo {
    display: flex;
    gap: 40px;
}

.form-control {
    width: 100%;
    padding: 8px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--bs-body-color);
    background-color: transparent;
    border: var(--bs-border-width) solid #dbe1e6;
}
</style>
