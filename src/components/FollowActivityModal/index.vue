<template>
  <van-popup
    v-model:show="visible"
    position="center"
    round
    :style="{ width: '90%', maxWidth: '600px', height: '80vh' }"
    @close="handleClose"
    z-index='99999'
    teleport="body"
  >
    <div class="follow-activity-modal">
      <!-- 头部 -->
      <div class="modal-header">
        <h3 class="modal-title">{{ t('followActivity.title') }}</h3>
        <van-icon name="cross" size="20" @click="handleClose" class="close-icon" />
      </div>

      <!-- Tab切换 -->
      <div class="modal-tabs">
        <van-tabs v-model:active="activeTab" @change="handleTabChange">
          <van-tab :title="t('followActivity.activityList')" name="list" />
          <van-tab :title="t('followActivity.receiveRecord')" name="record" />
        </van-tabs>
      </div>

     

      <!-- 内容区域 -->
      <div class="modal-content">
        <!-- 跟投活动列表 -->
        <div v-if="activeTab === 'list'" class="activity-list">
          <!-- 当前投注总计 -->
          <div class="bet-total" v-if="betTotal">
            <span class="label">{{ t('followActivity.currentBetTotal') }}:</span>
            <span class="value">₫{{ formatAmount(betTotal) }}</span>
          </div>

          <van-pull-refresh v-model="listRefreshing" @refresh="onRefreshActivityList">
            <van-list
              v-model:loading="listLoading"
              :finished="listFinished"
              :finished-text="$t('common.noMore')"
              :immediate-check="false"
              @load="loadActivityList"
            >
              <div
                v-for="item in activityList"
                :key="item.id"
                class="activity-item"
              >
                <div class="activity-header">
                  <h4 class="activity-title">{{ item.title }}</h4>
                  <div class="activity-bonus">₫{{ formatAmount(item.bonus) }}</div>
                </div>
                <div class="activity-info">
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.betAmount') }}:</span>
                    <span class="value">₫{{ formatAmount(item.bet_amount) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.rewardAmount') }}:</span>
                    <span class="value">₫{{ formatAmount(item.bonus) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.status') }}:</span>
                    <span class="value" :class="getStatusClass(item.can_receive)">
                      {{ getStatusText(item.can_receive) }}
                    </span>
                  </div>
                  <div class="info-row" v-if="item.remark">
                    <span class="label">{{ $t('followActivity.remark') }}:</span>
                    <span class="value">{{ item.remark }}</span>
                  </div>
                  <!-- <div class="info-row">
                    <span class="label">{{ $t('followActivity.startTime') }}:</span>
                    <span class="value">{{ item.start_time }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.endTime') }}:</span>
                    <span class="value">{{ item.end_time }}</span>
                  </div> -->
                </div>
                <div class="activity-actions">
                  <van-button
                    type="primary"
                    size="small"
                    :disabled="item.can_receive !== 1"
                    :loading="receivingId === item.id"
                    @click="handleReceive(item.id)"
                  >
                    {{ t('followActivity.receive') }}
                  </van-button>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>

          <!-- 空状态 -->
          <van-empty
            v-if="!listLoading && activityList.length === 0"
            :description="t('followActivity.noActivity')"
            image="search"
          />
        </div>

        <!-- 任务领取记录 -->
        <div v-if="activeTab === 'record'" class="record-list">
          <van-pull-refresh v-model="recordRefreshing" @refresh="onRefreshReceiveRecord">
            <van-list
              v-model:loading="recordLoading"
              :finished="recordFinished"
              :finished-text="$t('common.noMore')"
              :immediate-check="false"
              @load="loadReceiveRecord"
            >
              <div
                v-for="item in receiveRecordList"
                :key="item.id"
                class="record-item"
              >
                <div class="record-header">
                  <h4 class="record-title">{{ item.title }}</h4>
                  <div class="record-bonus">₫{{ formatAmount(item.bonus) }}</div>
                </div>
                <div class="record-info">
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.orderNumber') }}:</span>
                    <span class="value">{{ item.order_number }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">{{ $t('followActivity.receiveTime') }}:</span>
                    <span class="value">{{ item.created_at }}</span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>

          <!-- 空状态 -->
          <van-empty
            v-if="!recordLoading && receiveRecordList.length === 0"
            :description="t('followActivity.noRecord')"
            image="search"
          />
        </div>

         <!-- 提示信息 -->
      <div class="modal-tips" >
        <div class="tips-card">
          <div class="tips-header">
            <van-icon name="warning-o" size="18" class="tips-icon" />
            <span class="tips-title">{{ t('followActivity.tipsTitle') }}</span>
          </div>
          <div class="tips-content">
            <div class="tips-text" v-html="formatTipsText(t('followActivity.tips'))"></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { showToast } from 'vant'
import { $t } from '@/locales'

// 使用类型断言避免类型错误
const t = (key: string) => $t(key as any)
import { getFollowList, getFollowReceiveList, receiveFollow } from '@/api/follow'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:show': [value: boolean]
  'close': []
}>()

const visible = ref(props.show)
const activeTab = ref<'list' | 'record'>('list')

// 活动列表相关
const activityList = ref<any[]>([])
const listLoading = ref(false)
const listRefreshing = ref(false)
const listFinished = ref(false)
const listPageIndex = ref(1)
const betTotal = ref<string>('')
const receivingId = ref<number | null>(null)

// 领取记录相关
const receiveRecordList = ref<any[]>([])
const recordLoading = ref(false)
const recordRefreshing = ref(false)
const recordFinished = ref(false)
const recordPageIndex = ref(1)

// 监听show变化
watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 打开弹窗时加载数据
    if (activeTab.value === 'list') {
      loadActivityList()
    } else {
      loadReceiveRecord()
    }
  }
})

// 监听visible变化，同步到父组件
watch(visible, (newVal) => {
  emit('update:show', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 组件挂载时，如果show为true，加载数据
onMounted(() => {
  if (props.show && visible.value) {
    // 重置分页状态
    listPageIndex.value = 1
    listFinished.value = false
    activityList.value = []
    recordPageIndex.value = 1
    recordFinished.value = false
    receiveRecordList.value = []
    
    if (activeTab.value === 'list') {
      // 首次加载时，pageIndex已经是1，加载完成后会自动变成2
      loadActivityList()
    } else {
      loadReceiveRecord()
    }
  }
})

// Tab切换
const handleTabChange = (name: string) => {
  activeTab.value = name as 'list' | 'record'
  if (name === 'list') {
    // 重置分页状态
    listPageIndex.value = 1
    listFinished.value = false
    activityList.value = []
    loadActivityList()
  } else {
    // 重置分页状态
    recordPageIndex.value = 1
    recordFinished.value = false
    receiveRecordList.value = []
    loadReceiveRecord()
  }
}

// 加载跟投活动列表
const loadActivityList = async () => {
  if (listLoading.value) return
  
  try {
    listLoading.value = true
    const res = await getFollowList({ pageIndex: listPageIndex.value }) as any
    const rows = res?.rows || []
    const total = res?.total || 0
    
    if (listPageIndex.value === 1) {
      activityList.value = rows
    } else {
      activityList.value.push(...rows)
    }
    
    betTotal.value = res?.report?.bet_amount || ''
    
    // 判断是否还有更多数据
    // 如果返回的数据为空，或者已加载的数据量达到总数，则没有更多数据
    if (rows.length === 0) {
      // 返回数据为空，没有更多数据了
      listFinished.value = true
    } else if (total > 0 && activityList.value.length >= total) {
      // 已加载的数据量达到总数，没有更多数据了
      listFinished.value = true
    } else {
      // 还有更多数据，准备加载下一页
      listFinished.value = false
      // 注意：pageIndex 在加载完成后才自增，这样下次@load触发时会加载下一页
      listPageIndex.value++
    }
  } catch (error: any) {
    showToast(error?.msg || t('followActivity.loadFailed'))
    listFinished.value = true
  } finally {
    // 确保loading状态正确设置，这样van-list才能继续触发@load事件
    listLoading.value = false
    listRefreshing.value = false
  }
}

// 下拉刷新活动列表
const onRefreshActivityList = async () => {
  listPageIndex.value = 1
  listFinished.value = false
  activityList.value = []
  await loadActivityList()
}

// 加载领取记录
const loadReceiveRecord = async () => {
  if (recordLoading.value) return
  
  try {
    recordLoading.value = true
    const res = await getFollowReceiveList({ pageIndex: recordPageIndex.value }) as any
    const rows = res?.rows || []
    const total = res?.total || 0
    
    if (recordPageIndex.value === 1) {
      receiveRecordList.value = rows
    } else {
      receiveRecordList.value.push(...rows)
    }
    
    // 判断是否还有更多数据
    // 如果返回的数据为空，或者已加载的数据量达到总数，则没有更多数据
    if (rows.length === 0) {
      // 返回数据为空，没有更多数据了
      recordFinished.value = true
    } else if (total > 0 && receiveRecordList.value.length >= total) {
      // 已加载的数据量达到总数，没有更多数据了
      recordFinished.value = true
    } else {
      // 还有更多数据，准备加载下一页
      recordFinished.value = false
      // 注意：pageIndex 在加载完成后才自增，这样下次@load触发时会加载下一页
      recordPageIndex.value++
    }
  } catch (error: any) {
    showToast(error?.msg || t('followActivity.loadFailed'))
    recordFinished.value = true
  } finally {
    // 确保loading状态正确设置，这样van-list才能继续触发@load事件
    recordLoading.value = false
    recordRefreshing.value = false
  }
}

// 下拉刷新领取记录
const onRefreshReceiveRecord = async () => {
  recordPageIndex.value = 1
  recordFinished.value = false
  receiveRecordList.value = []
  await loadReceiveRecord()
}

// 领取活动
const handleReceive = async (id: number) => {
  try {
    receivingId.value = id
    await receiveFollow({ id })
    showToast(t('followActivity.receiveSuccess'))
    // 重新加载列表
    listPageIndex.value = 1
    listFinished.value = false
    activityList.value = []
    await loadActivityList()
  } catch (error: any) {
    showToast(error?.msg || t('followActivity.receiveFailed'))
  } finally {
    receivingId.value = null
  }
}

// 格式化金额
const formatAmount = (amount: string | number) => {
  if (!amount) return '0'
  const num = parseFloat(amount.toString())
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化提示文本，将换行符转换为<br>
const formatTipsText = (text: string) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

// 获取状态文本
const getStatusText = (canReceive: number) => {
  if (canReceive === 1) {
    return t('followActivity.canReceive')
  }
  return t('followActivity.cannotReceive')
}

// 获取状态样式类
const getStatusClass = (canReceive: number) => {
  return canReceive === 1 ? 'status-available' : 'status-unavailable'
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.follow-activity-modal {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-icon {
  cursor: pointer;
  color: #999;
}

.modal-tabs {
  background: #fff;
}

.modal-tips {
  margin: 0;
}

.tips-card {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 193, 7, 0.3);
}

.tips-icon {
  color: #ff9800;
  flex-shrink: 0;
}

.tips-title {
  font-size: 16px;
  font-weight: 700;
  color: #e65100;
  letter-spacing: 0.5px;
}

.tips-content {
  line-height: 1.8;
}

.tips-text {
  font-size: 14px;
  color: #856404;
  font-weight: 500;
  white-space: pre-wrap;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  background: #f5f5f5;
  min-height: 0; /* 确保flex子元素可以收缩 */
}

/* 活动列表样式 */
.activity-list,
.record-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.bet-total {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bet-total .label {
  font-size: 14px;
  color: #666;
}

.bet-total .value {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b35;
}

.activity-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.activity-bonus {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b35;
}

.activity-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  color: #666;
}

.info-row .value {
  color: #333;
  font-weight: 500;
}

.status-available {
  color: #52c41a;
}

.status-unavailable {
  color: #999;
}

.activity-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 领取记录样式 */
.record-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.record-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.record-bonus {
  font-size: 18px;
  font-weight: 700;
  color: #52c41a;
}

.record-info {
  font-size: 14px;
}

:deep(.van-tabs__line) {
  background: #1890ff;
}

:deep(.van-tab--active) {
  color: #1890ff;
}
</style>

