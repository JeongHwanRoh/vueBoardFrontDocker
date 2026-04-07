<!-- 
게시판 테이블 동적으로 재사용 가능
-->

<!-- 
** 상위 페이지에서 컴포넌트 불러오는법 **

columns 형태와 rows에 사용할 Entity 정의하고,
<BoardTable :columns="tableColumns" :rows="notices" idKey="PK명"  />로 불러오면 됨.
=> 칸반 스케줄러 페이지에서 복사해서 재사용(테이블 스타일만 변경)

-->

<template>
  <table class="scheduler-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row[rowIdKey]"
        :class="resolveRowClass(row)"
      >

        <td v-for="col in columns" :key="col.key">
          <!-- 날짜 입력 컬럼인 경우 DateInput 컴포넌트 렌더링 
            실제 시작일 (actualStartDate)이 없는 경우 실제 종료일(actualEndDate) 입력 비활성화 -->
           
          <date-input v-if="col.isDate" :modelValue="row[col.key] ?? ''"
            :disabled="col.key === 'actualEndDate' && !row.actualStartDate"
            @update:modelValue="(val: string) => emit('dateChange', { rowId: row[rowIdKey], key: col.key, value: val })" />

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
  rowClass?: string | ((row: any) => string | string[] | Record<string, boolean> | undefined)
}>();

const emit = defineEmits<{
  dateChange: [payload: { rowId: any; key: string; value: string }]
}>()

// rowIdKey 기본값 설정 (props 변경에 자동 갱신되도록 computed 설정) 
const rowIdKey = computed(() => props.idKey ?? 'id');

const resolveRowClass = (row: any) => {
  if (typeof props.rowClass === 'function') {
    return props.rowClass(row)
  }

  return props.rowClass
}
</script>

<style scoped>
.scheduler-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  color: #333;
}

.scheduler-table thead tr {
  background-color: #f5f6fa;
  border-top: 2px solid #dee2e6;
  border-bottom: 2px solid #dee2e6;
}

.scheduler-table thead th {
  padding: 12px 10px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  color: #444;
  border-right: 1px solid #e5e7eb;
}

.scheduler-table thead th:last-child {
  border-right: none;
}

.scheduler-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s;
}

.scheduler-table tbody tr:hover {
  background-color: #f0f4ff;
}

.scheduler-table tbody tr.notification-row {
  background-color: #eaf4ff;
}

.scheduler-table tbody tr.notification-row:hover {
  background-color: #dceeff;
}

.scheduler-table tbody td {
  padding: 10px 10px;
  text-align: center;
  vertical-align: middle;
  border-right: 1px solid #e5e7eb;
  color: #555;
}

.scheduler-table tbody tr.notification-row td {
  color: #1f3f68;
}

.scheduler-table tbody td:last-child {
  border-right: none;
}
</style>
