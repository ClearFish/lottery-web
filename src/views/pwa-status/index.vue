<template>
  <div class="pwa-status-page">
    <van-nav-bar :title="$t('pwa.title')" left-arrow @click-left="goBack" />
    
    <div class="page-content">
      <PWAStatus />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PWAStatus from '@/components/PWAStatus/index.vue'
import { $t } from '@/locales'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.pwa-status-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  padding: 16px;
}
</style>
