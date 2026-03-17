<template>
    <div class="dashboard">

        <!-- 2행 x 3열 그리드 -->
        <div class="dashboard-grid">

            <!-- Row 1, Col 1: 숫자 카드 -->
            <div class="grid-cell cell-stats">
                <div class="stat-cards">
                    <div class="stat-card">
                        <h2 class="stat-number">{{  }}</h2>
                        <span class="stat-label">게시물</span>
                    </div>
                    <div class="stat-card">
                        <h2 class="stat-number">{{ totalCards }}</h2>
                        <span class="stat-label">업무</span>
                    </div>
                </div>
            </div>

            <!-- Row 1, Col 2: 게시판 -->
            <div class="grid-cell">
                <div class="card dashboard-card h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle fw-semibold mb-3">게시판</h6>
                        <BoardTable :columns="tableColumns" :rows="boards" idKey="boardId" />
                        
                    </div>
                </div>
            </div>

            <!-- Row 1, Col 3: 달력 -->
            <div class="grid-cell">
                <div class="card dashboard-card h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle fw-semibold mb-3">일정</h6>
                        <CalendarTemplate />
                    </div>
                </div>
            </div>

            <!-- Row 2, Col 1: 최근 게시물 -->
            <div class="grid-cell">
                <div class="card dashboard-card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <h6 class="card-subtitle fw-semibold mb-0">최근 게시물</h6>
                            <router-link to="/board" class="text-primary small">전체보기 →</router-link>
                        </div>
                        <ul class="recent-list">
                            <li v-for="b in boards" :key="b.boardId" class="recent-item">
                                <router-link :to="`/board/${b.boardId}`">{{ b.title }}</router-link>
                                <span class="text-muted small">{{ b.writer }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Row 2, Col 2: 업무진척도 -->
            <div class="grid-cell">
                <div class="card dashboard-card h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle fw-semibold mb-3">업무진척도</h6>
                        <KanbanBoardComponent :columns="columns" @editCard="editCard" @deleteCard="deleteCard"
                            @cardsReordered="loadKanbanData" />
                    </div>
                </div>
            </div>

            <!-- Row 2, Col 3: 업무 완료율 -->
            <div class="grid-cell">
                <div class="card dashboard-card h-100">
                    <div class="card-body">
                        <h6 class="card-subtitle fw-semibold mb-3">업무 완료율</h6>

                        <!-- 도넛 차트 -->
                        <!-- SVG로 구현 (2차원 벡터 그래픽을 서술하는 XML 기반 웹 표준 마크업 언어)-->
                        <div class="donut-chart-wrapper">
                            <svg viewBox="0 0 120 120" class="donut-chart">
                                <circle cx="60" cy="60" r="50" class="donut-bg" />
                                <circle cx="60" cy="60" r="50" class="donut-ring donut-todo"
                                    :stroke-dasharray="`${todoArc} ${circumference}`" :stroke-dashoffset="0" />
                                <circle cx="60" cy="60" r="50" class="donut-ring donut-progress"
                                    :stroke-dasharray="`${progressArc} ${circumference}`"
                                    :stroke-dashoffset="`${-todoArc}`" />
                                <circle cx="60" cy="60" r="50" class="donut-ring donut-done"
                                    :stroke-dasharray="`${doneArc} ${circumference}`"
                                    :stroke-dashoffset="`${-(todoArc + progressArc)}`" />
                                <text x="60" y="56" class="donut-percent">{{ donePercent }}%</text>
                                <text x="60" y="72" class="donut-sub">완료</text>
                            </svg>
                        </div>

                        <!-- 범례 -->
                        <div class="donut-legend">
                            <div class="legend-item">
                                <span class="legend-dot" style="background:#e05555;"></span>
                                <span class="legend-label">예정</span>
                                <span class="legend-value">{{ todoCount }}건</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot" style="background:#3b82f6;"></span>
                                <span class="legend-label">진행중</span>
                                <span class="legend-value">{{ progressCount }}건</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot" style="background:#4caf50;"></span>
                                <span class="legend-label">완료</span>
                                <span class="legend-value">{{ doneCount }}건</span>
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
import KanbanBoardComponent from '~/components/organisms/kanban/KanbanBoard.vue'
import { fetchKanbanBoardId } from '~/lib/apiService/kanbanBoardApi'
import { fetchKanbanCards } from '~/lib/apiService/kanbanCardApi'
import type { KanbanColumnDto } from '~/lib/types/kanban'

const { boards, getLatestBoards } = useRecentFiveBoard()
const kanbanStore = useKanbanStore()
const { columns, boardId } = storeToRefs(kanbanStore)
const router = useRouter();

const totalCards = computed(() => columns.value.reduce((sum, col) => sum + col.cards.length, 0))

const todoCount = computed(() => columns.value.find(c => c.columnName === 'TODO')?.cards.length ?? 0)
const progressCount = computed(() => columns.value.find(c => c.columnName === 'IN_PROGRESS')?.cards.length ?? 0)
const doneCount = computed(() => columns.value.find(c => c.columnName === 'DONE')?.cards.length ?? 0)
const donePercent = computed(() => totalCards.value === 0 ? 0 : Math.round((doneCount.value / totalCards.value) * 100))

const circumference = 2 * Math.PI * 50 // ~314.16
const todoArc = computed(() => totalCards.value === 0 ? 0 : (todoCount.value / totalCards.value) * circumference)
const progressArc = computed(() => totalCards.value === 0 ? 0 : (progressCount.value / totalCards.value) * circumference)
const doneArc = computed(() => totalCards.value === 0 ? 0 : (doneCount.value / totalCards.value) * circumference)

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

const loadKanbanData = async () => {
    try {
        const board = await fetchKanbanBoardId()
        kanbanStore.setBoard(board)
        const cards = await fetchKanbanCards(board.boardId)
        kanbanStore.setCardsByColumn(cards)
    } catch (error) {
        console.error('칸반 데이터 로드 실패:', error)
    }
}

const editCard = (card: KanbanColumnDto) => {
    router.push({
        path: `/kanban/${card.cardId}`,
        state: {
            title: card.title ?? '',
            cardInfo: card.cardInfo ?? '',
            columnName: card.columnName ?? 'TODO',
        },
    })
}

const deleteCard = async (cardId: number) => {
    kanbanStore.deleteCard(cardId)
}

onMounted(() => {
    getLatestBoards()
    loadKanbanData()
})
</script>

<style scoped>
.dashboard {
    padding: 24px 32px;
}

/* 2행 x 3열 그리드 — 행 높이 자동, 같은 행 내 셀 높이 일치 */
.dashboard-grid {
    display: grid;
    grid-template-columns: 160px 1fr 280px;
    grid-template-rows: auto auto;
    gap: 20px;
}

.grid-cell {
    min-width: 0;
}

/* 숫자 카드 셀은 세로 배치 */
.cell-stats {
    display: flex;
    flex-direction: column;
}

/* h-100 으로 카드가 셀 높이에 맞게 늘어남 */
.h-100 {
    height: 100%;
}

.dashboard-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    margin-bottom: 0;
}

.card-subtitle {
    font-size: 0.92rem;
    color: #555;
}

/* 숫자 카드 */
.stat-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
}

.stat-card {
    flex: 1;
    background: #f8f9fc;
    border-radius: 12px;
    padding: 16px 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0;
    line-height: 1.2;
}

.stat-label {
    font-size: 0.78rem;
    color: #999;
    font-weight: 500;
    margin-top: 4px;
}

/* 최근 게시물 */
.recent-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.recent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f2f2f2;
}

.recent-item:last-child {
    border-bottom: none;
}

.recent-item a {
    color: #333;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

.recent-item a:hover {
    color: #5d5fef;
}

/* 도넛 차트 */
.donut-chart-wrapper {
    display: flex;
    justify-content: center;
    padding: 8px 0 16px;
}

.donut-chart {
    width: 140px;
    height: 140px;
    transform: rotate(-90deg);
}

.donut-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 14;
}

.donut-ring {
    fill: none;
    stroke-width: 14;
    stroke-linecap: round;
    transition: stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease;
}

.donut-todo {
    stroke: #e05555;
}

.donut-progress {
    stroke: #3b82f6;
}

.donut-done {
    stroke: #4caf50;
}

.donut-percent {
    font-size: 1.4rem;
    font-weight: 700;
    fill: #333;
    text-anchor: middle;
    dominant-baseline: auto;
    transform: rotate(90deg);
    transform-origin: 60px 60px;
}

.donut-sub {
    font-size: 0.7rem;
    fill: #999;
    text-anchor: middle;
    dominant-baseline: auto;
    transform: rotate(90deg);
    transform-origin: 60px 60px;
}

/* 범례 */
.donut-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.legend-label {
    color: #666;
    flex: 1;
}

.legend-value {
    font-weight: 600;
    color: #333;
}

/* 반응형 */
@media (max-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: 1fr 1fr;
    }

    .cell-stats {
        grid-column: 1 / -1;
    }

    .stat-cards {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .stat-card {
        flex: 1 1 100px;
    }
}

@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .dashboard {
        padding: 16px;
    }
}
</style>
