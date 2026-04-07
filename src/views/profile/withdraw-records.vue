<template>
  <div class="withdraw-records-page">
    <!-- 提现记录列表 -->
    <div class="records-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('common.noMore')"
          @load="onLoad"
        >
          <div 
            v-for="record in records" 
            :key="record.id"
            class="record-item"
          >
            <div class="record-header">
              <div class="record-amount">₫{{ record.money }}</div>
              <div class="record-status" :class="`status-${record.status}`">
                {{ getStatusText(record.status) }}
              </div>
            </div>
            <div class="record-info">
              <div class="info-row">
                <span class="info-label">{{ $t('withdrawRecords.withdrawMethod') }}:</span>
                <span class="info-value">{{ record.method}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('withdrawRecords.orderNumber') }}:</span>
                <span class="info-value">{{ record.order_number }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ $t('withdrawRecords.applyTime') }}:</span>
                <span class="info-value">{{ formatTime(record.createdAt) }}</span>
              </div>
              <div v-if="record.processedAt" class="info-row">
                <span class="info-label">{{ $t('withdrawRecords.processTime') }}:</span>
                <span class="info-value">{{ formatTime(record.processedAt) }}</span>
              </div>
              <div v-if="record.adminNotes" class="info-row">
                <span class="info-label">{{ $t('withdrawRecords.notes') }}:</span>
                <span class="info-value">{{ record.adminNotes }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 空状态 -->
    <van-empty 
      v-if="!loading && records.length === 0" 
      :description="$t('withdrawRecords.noRecords')"
      image="search"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEarningsStore } from '@/store/modules/earnings'
import { $t } from '@/locales'

const earningsStore = useEarningsStore()

const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

const records = ref(earningsStore.withdrawals)

const getStatusText = (status: number | string) => {
  const statusMap: Record<number | string, string> = {
    0: $t('withdrawRecords.pending'),      // 待审
    1: $t('withdrawRecords.completed'),    // 成功
    2: $t('withdrawRecords.rejected'),     // 失败
    3: $t('withdrawRecords.processing'),    // 处理中
    4: $t('withdrawRecords.rejected'),     // 失败
    5: $t('withdrawRecords.rejected'),     // 失败
  }
  return statusMap[status] ?? status
}


const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

const onLoad = () => {
  // TODO: 实现分页加载
  finished.value = true
}

const onRefresh = async () => {
  refreshing.value = true
  try {
    await earningsStore.fetchWithdrawals()
    records.value = earningsStore.withdrawals
  } catch (error) {
    console.error('刷新提现记录失败:', error)
  } finally {
    refreshing.value = false
  }
}

onMounted(() => {
  onRefresh()
})
</script>

<style scoped>
.withdraw-records-page {
  padding-bottom: 60px;
}

.records-list {
  padding: 16px;
}

.record-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-amount {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.record-status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* 状态 0: 待审 */
.status-0 {
  background: #fff7e6;
  color: #fa8c16;
}

/* 状态 1: 成功 */
.status-1 {
  background: #e8f5e8;
  color: #52c41a;
}

/* 状态 2: 失败 */
.status-2 {
  background: #fff2f0;
  color: #ff4d4f;
}

/* 状态 3: 处理中 */
.status-3 {
  background: #e6f7ff;
  color: #1890ff;
}

.record-info {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}
</style>
