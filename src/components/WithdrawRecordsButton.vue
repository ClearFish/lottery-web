<template>
  <van-icon 
    name="notes-o"  
    size="20" 
    @click="goToWithdrawRecords"
    class="withdraw-records-icon"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToWithdrawRecords = () => {
  router.push('/profile/withdraw-records')
}
</script>

<style scoped>
.withdraw-records-icon {
  cursor: pointer;
  color: #1989fa;
  transition: color 0.3s;
}

.withdraw-records-icon:hover {
  color: #0570db;
}
</style>
