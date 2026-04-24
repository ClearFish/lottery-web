<template>
  <router-view />
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useSystemStore } from '@/store/modules/system'
const systemStore = useSystemStore()
onMounted(() => {
  systemStore.getSysTime()
  systemStore.getInfo()
  systemStore.getGame()
  systemStore.getBalance()
})
</script>
<style></style>
