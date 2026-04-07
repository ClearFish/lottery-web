<template>
  <router-view />
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useSiteStore } from '@/store/modules/site'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
const siteStore = useSiteStore()
const { data, getData } = useVisitorData({ extendedResult: true }, { immediate: false })
watch(data, (currentData) => {
  if (currentData) {
    siteStore.setDeviceId(currentData.visitorId)
    localStorage.setItem('deviceId', currentData.visitorId)
  }
})
onMounted(() => {
  console.log('app mounted')
  const cachedId = localStorage.getItem('deviceId')
  if (cachedId) {
    siteStore.setDeviceId(cachedId)
  } else {
    getData()
  }
})
</script>
<style></style>
