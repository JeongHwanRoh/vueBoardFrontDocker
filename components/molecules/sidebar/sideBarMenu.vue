<template>
    <nav>
        <ul>
            <li v-for="item in menu" :key="item.path" :class="{ active: isActive(item.path) }"
                @click="emit('navigate', item.path)">
                {{ item.label }}
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
interface MenuItem {
    label: string
    path: string
}

const props = defineProps<{
    menu: MenuItem[]
    activePath: string
}>()

const emit = defineEmits<{
    (e: 'navigate', path: string): void
}>()

const isActive = (path: string) => {
    return props.activePath.startsWith(path)
}
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    padding: 12px 10px;
    cursor: pointer;
    border-radius: 6px;
}

li:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

li.active {
    background-color: rgba(255, 255, 255, 0.25);
    font-weight: bold;
}
</style>
