<template>
    <div>
        <button type="button" class="logout-btn" @click="logoutHandler">
            <img width="30" src="../../../assets/images/logouticon.png" alt="logout icon" />
        </button>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'
import { useUserStore } from '~/stores/userStore'
import { logout } from '~/lib/apiService/userApi'

const router = useRouter()
const userStore = useUserStore()

const logoutHandler = async () => {
    await logout()
    userStore.clearUser()
    router.push('/login')
}
</script>

<style scoped>
/* button {
    margin-top: 1rem;
    width: 100%;
} */

.logout-btn {
    background-color: transparent;
    border: none;
    bottom: 0;          /* 하단 경계에 맞춤 */
    left: 0;            /* 좌측 경계에 맞춤 */
    /* 필요하다면 약간의 간격(padding/margin) 추가 */
    padding: 10px 0px; 
}
</style>
