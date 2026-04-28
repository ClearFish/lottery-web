<template>
  <router-view v-if="ready" />
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useSystemStore } from '@/store/modules/system'
const systemStore = useSystemStore()
const ready = ref(false)
onBeforeMount(async () => {
  await Promise.all([
    systemStore.getSysTime(),
    systemStore.getInfo(),
    systemStore.getGame(),
    systemStore.getBalance()
  ])
  ready.value = true
})
</script>
<style></style>
