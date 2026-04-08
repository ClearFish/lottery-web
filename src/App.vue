<template>
  <router-view />
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
onMounted(() => {
  console.log('app mounted')
})
</script>
<style></style>
