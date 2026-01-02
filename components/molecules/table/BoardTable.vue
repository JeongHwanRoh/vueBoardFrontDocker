<!-- 
게시판 테이블 동적으로 재사용 가능
-->

<!-- 
** 상위 페이지에서 컴포넌트 불러오는법 **

columns 형태와 rows에 사용할 Entity 정의하고,
<BoardTable :columns="tableColumns" :rows="notices" idKey="PK명"  />로 불러오면 됨.

=>notice/index.vue 참고하기

-->

<template>
  <table class="table text-nowrap align-middle mb-0">
    <thead>
      <tr class="border-2 border-bottom border-primary border-0">
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="row in rows" :key="row[rowIdKey]">
        
        <td v-for="col in columns" :key="col.key">
          
          <!-- 링크 컬럼인 경우 (예: 제목 클릭 시 상세 페이지 이동) -->
          <router-link
            v-if="col.isLink"
            :to="col.to ? col.to(row) : ''"
          >
            {{ row[col.key] }}
          </router-link>

          <!-- 날짜 포맷을 위해 formatter 적용(예: formatDate 날짜 형식 변환 함수 적용) -->
          <span v-else-if="col.format">
            {{ col.format(row[col.key], row) }}
          </span>

          <!-- 기본 렌더링 -->
          <span v-else>
            {{ row[col.key] ?? '-' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
// import { defineProps } from 'vue';

interface Column {
  key: string;               // 실제 데이터 key
  label: string;             // 화면에 표시할 제목
  isLink?: boolean;          // 링크 여부
  to?: (row: any) => string; // router-link 경로 생성 함수
  format?: (value: any, row?: any) => string; // value formatting
}

const props = defineProps<{
  columns: Column[];
  rows: any[];
  idKey: string; // row 의 unique key (default: id)
}>();

// rowIdKey 기본값 설정 (props 변경에 자동 갱신되도록 computed 설정) 
const rowIdKey=computed(()=>props.idKey ?? 'id');
</script>

