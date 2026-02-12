<template>
    <div class="container-fluid">

        <!-- 공지사항 + 우측 카드 -->
        <div class="row">
            <!-- 공지사항 -->
            <div class="col-lg-8">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold mb-4">공지사항</h5>
                        <BoardTable :columns="tableColumns" :rows="boards" idKey="boardId" />
                    </div>
                </div>
            </div>

            <!-- 달력(Full Calendar) -->
              <div class="col-lg-4">
                  <CalendarTemplate />
              </div>
        </div>

        <!-- 채팅현황 (아래) -->
        <div class="row">

            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">업무현황</h5>

                        <div class="table-responsive">
                            <table class="table text-nowrap align-middle mb-0">
                                <thead>
                                    <tr class="border-bottom border-primary">
                                        <th class="ps-0">Page Title</th>
                                        <th>Link</th>
                                        <th class="text-center">Pageviews</th>
                                        <th class="text-center">Page Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th class="ps-0">Welcome to our website</th>
                                        <td>/index.html</td>
                                        <td class="text-center">18,456</td>
                                        <td class="text-center">$2.40</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0">Modern Admin Dashboard</th>
                                        <td>/dashboard</td>
                                        <td class="text-center">17,452</td>
                                        <td class="text-center">$0.97</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0">Explore our product catalog</th>
                                        <td>/product-checkout</td>
                                        <td class="text-center">12,180</td>
                                        <td class="text-center">$7.50</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0">Comprehensive User Guide</th>
                                        <td>/docs</td>
                                        <td class="text-center">800</td>
                                        <td class="text-center">$5.50</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0">Check out our services</th>
                                        <td>/services</td>
                                        <td class="text-center">1,300</td>
                                        <td class="text-center">$2.15</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title d-flex align-items-center gap-2 mb-5 pb-3">
                            기타 대시보드
                            <Icon icon="solar:question-circle-bold" class="fs-7 d-flex text-muted" />
                        </h5>

                        <div class="row text-center">
                            <div class="col-4">
                                <Icon icon="solar:laptop-minimalistic-line-duotone" class="fs-5 text-primary" />
                                <span class="fs-11 mt-2 d-block text-nowrap">노정환</span>
                                <h4 class="mb-0 mt-1">87%</h4>
                            </div>
                            <div class="col-4">
                                <Icon icon="solar:smartphone-line-duotone" class="fs-5 text-secondary" />
                                <span class="fs-11 mt-2 d-block text-nowrap">이민아</span>
                                <h4 class="mb-0 mt-1">9.2%</h4>
                            </div>
                            <div class="col-4">
                                <Icon icon="solar:tablet-line-duotone" class="fs-5 text-success" />
                                <span class="fs-11 mt-2 d-block text-nowrap">Jason</span>
                                <h4 class="mb-0 mt-1">3.1%</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</template>

<script setup lang="ts">
import CalendarTemplate from '~/components/molecules/calendar/calendarTemplate.vue'
import BoardTable from '~/components/molecules/table/BoardTable.vue'
import { useRecentFiveBoard } from '~/lib/composables/board/fetchAllBoard'

const { boards, getLatestBoards } = useRecentFiveBoard()

const tableColumns = [
    { key: 'boardId', label: '번호' },
    {
        key: 'title',
        label: '제목',
        isLink: true,
        to: (row: any) => `/board/${row.boardId}`
    },
    { key: 'writer', label: '작성자' },
    {
        key: 'regdate',
        label: '등록날짜',
        format: (_: any, row: any) => formatDate(row.updatedAt || row.regdate)
    },
    { key: 'viewcnt', label: '조회수' }
]

const formatDate = (timestamp?: string) => {
    if (!timestamp) return '-'
    return new Date(timestamp + 'Z').toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    })
}

onMounted(() => {
    getLatestBoards()
})
</script>

<style scoped>
div>.row {
  --bs-gutter-x: 30px;
  --bs-gutter-y: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex !important;
  flex-wrap: nowrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
}

</style>
