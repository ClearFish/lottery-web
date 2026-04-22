<template>
  <router-view />
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useSystemStore } from '@/store/modules/system'

const systemStore = useSystemStore()

onMounted(() => {
  console.log('app mounted')
  systemStore.getSysTime()
  systemStore.getInfo()
  // systemStore.getGameConfig()
})
</script>
<style></style>
