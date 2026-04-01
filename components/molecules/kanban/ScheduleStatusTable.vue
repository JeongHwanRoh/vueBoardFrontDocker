<!-- 
게시판 테이블 동적으로 재사용 가능
-->

<!-- 
** 상위 페이지에서 컴포넌트 불러오는법 **

columns 형태와 rows에 사용할 Entity 정의하고,
<BoardTable :columns="tableColumns" :rows="notices" idKey="PK명"  />로 불러오면 됨.
=> 칸반 일정 상태 관리 페이지에서 복사해서 재사용(테이블 스타일만 변경)

-->

<template>
  <table class="schedule-status-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row[rowIdKey]">
        
        <td v-for="col in columns" :key="col.key">
          
          <!-- 링크 컬럼인 경우 (예: 제목 클릭 시 상세 페이지 이동) -->
          <router-link
            v-if="col.isLink"
            :to="col.to ? col.to(row) : ''"
          >
            {{ row[col.key] }}
          </router-link>

          <!-- 날짜 입력 컬럼인 경우 DateInput 컴포넌트 렌더링 -->
          <date-input
            v-else-if="col.isDate"
            :modelValue="row[col.key] ?? ''"
            @update:modelValue="(val: string) => emit('dateChange', { rowId: row[rowIdKey], key: col.key, value: val })"
          />

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
import DateInput from '~/components/atoms/DateInput.vue';

// import { defineProps } from 'vue';

interface Column {
  key: string;               // 실제 데이터 key
  label: string;             // 화면에 표시할 제목
  isLink?: boolean;          // 링크 여부
  isDate?: boolean;          // 날짜 입력 여부 (DateInput 컴포넌트 렌더링)
  to?: (row: any) => string; // router-link 경로 생성 함수
  format?: (value: any, row?: any) => string; // value formatting
}

const props = defineProps<{
  columns: Column[];
  rows: any[];
  idKey: string; // row 의 unique key (default: id)
}>();

const emit = defineEmits<{
  dateChange: [payload: { rowId: any; key: string; value: string }]
}>()

// rowIdKey 기본값 설정 (props 변경에 자동 갱신되도록 computed 설정) 
const rowIdKey=computed(()=>props.idKey ?? 'id');
</script>

<style scoped>
.schedule-status-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  color: #333;
}

.schedule-status-table thead tr {
  background-color: #f5f6fa;
  border-top: 2px solid #dee2e6;
  border-bottom: 2px solid #dee2e6;
}

.schedule-status-table thead th {
  padding: 12px 10px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  color: #444;
  border-right: 1px solid #e5e7eb;
}

.schedule-status-table thead th:last-child {
  border-right: none;
}

.schedule-status-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s;
}

.schedule-status-table tbody tr:hover {
  background-color: #f0f4ff;
}

.schedule-status-table tbody td {
  padding: 10px 10px;
  text-align: center;
  vertical-align: middle;
  border-right: 1px solid #e5e7eb;
  color: #555;
}

.schedule-status-table tbody td:last-child {
  border-right: none;
}
</style>
