<template>
    <div class="card-body notification-card-body">
        <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 class="card-subtitle fw-semibold mb-0">일정 알림</h6>
            <span class="notification-badge">{{ notificationItems.length }}</span>
        </div>
        <ul v-if="hasNotifications" class="notification-list">
            <li v-for="item in notificationItems" :key="item.id" class="notification-item">
                <span class="notification-type" :class="`notification-type-${item.type}`">
                    {{ item.type === 'start' ? '시작 확인' : '종료 확인' }}
                </span>
                <p class="notification-message mb-0">{{ item.message }}</p>
            </li>
        </ul>
        <div v-else class="notification-empty">
            오늘 확인이 필요한 일정이 없습니다.
        </div>

        <router-link to="/kanban/schedule-status" class="notification-link">
            일정 상태관리로 이동 →
        </router-link>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    notificationItems: Array<{ id: string; type: 'start' | 'end'; message: string }>;
    hasNotifications: boolean;
}>();

</script>

<style scoped>
.notification-card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-subtitle {
    font-size: 0.92rem;
    color: #555;
}

.notification-badge {
    min-width: 24px;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: #eef2ff;
    color: #3b82f6;
    font-size: 0.76rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.notification-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notification-item {
    padding: 12px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
}

.notification-type {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: 999px;
    padding: 4px 8px;
    margin-bottom: 8px;
}

.notification-type-start {
    color: #9a3412;
    background: #ffedd5;
}

.notification-type-end {
    color: #1d4ed8;
    background: #dbeafe;
}

.notification-message {
    color: #374151;
    font-size: 0.88rem;
    line-height: 1.5;
}

.notification-empty {
    min-height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
    border-radius: 12px;
    background: #f8fafc;
    color: #6b7280;
    font-size: 0.88rem;
}

.notification-link {
    margin-top: auto;
    color: #2563eb;
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
}

.notification-link:hover {
    color: #1d4ed8;
}
</style>
