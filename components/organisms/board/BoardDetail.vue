<template>
  <div>
    <!-- 공통 상세 UI (제목, 작성자, 날짜, 조회수, 내용) -->
    <BoardCommonDetail
      :item="props.board"
      titleKey="title"
      writerKey="writer"
      dateKey="regdate"
      viewKey="viewcnt"
      contentKey="content"
      :formatter="props.formatter"
    />

    <!-- 파일 다운로드 영역 -->
    <!-- <div class="row g-3">
      <DownLoadFile
        :file="props.file"
        @downloadFile="$emit('downloadFile',file?.fileId)"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">

import type { BoardResponse } from '~/lib/types/board';
import BoardCommonDetail from '~/components/molecules/table/BoardCommonDetail.vue';

const props = defineProps<{
  board: BoardResponse | null;
  formatter: (timestamp: any) => string;
}>();

</script>
