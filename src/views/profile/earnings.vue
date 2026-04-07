<template>
  <div class="earnings-page">
    <!-- 顶部三卡概览：总收益 / 任务收益 / 团队收益 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon total"><van-icon name="gold-coin-o" color="#ff6a00" size="18" /></div>
          <p class="summary-label">{{ $t('profile.totalEarnings') }}</p>
        </div>
        <div class="summary-amount">₫{{ earningsSummary.totalEarnings.toLocaleString() }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon task"><van-icon name="completed-o" color="#1890ff" size="18" /></div>
          <p class="summary-label">{{ $t('profile.taskEarnings') }}</p>
        </div>
        <div class="summary-amount">₫{{ earningsSummary.taskEarnings.toLocaleString() }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon team"><van-icon name="friends-o" color="#52c41a" size="18" /></div>
          <p class="summary-label">{{ $t('profile.teamEarnings') }}</p>
        </div>
        <div class="summary-amount">₫{{ earningsSummary.promotionEarnings.toLocaleString() }}</div>
      </div>
    </div>

    <!-- 列表切换：任务收益 / 团队收益 -->
    <div class="filter-section">
      <van-tabs v-model:active="activeTab" @change="handleTabChange" sticky>
        <van-tab :title="$t('profile.taskEarnings')" name="task">
          <div class="tab-content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                :finished-text="$t('common.noMore')"
                @load="onLoad"
              >
                <div v-if="earnings.length === 0 && !loading" class="empty-state">
                  <van-empty
                    :description="$t('profile.noEarningsRecord')"
                  />
                </div>
                
                <div v-else class="earnings-items">
                  <div 
                    v-for="earning in earnings" 
                    :key="earning.id"
                    class="earning-item"
                  >
         
                    <div class="earning-content">
                      <div class="earning-description">{{ earning.description || getEarningTypeName(earning.type) }}</div>
                      <div class="earning-time">{{ formatDate(earning.createdAt) }}</div>
                    </div>
                    <div class="earning-amount" :class="{ positive: earning.amount > 0 }">
                      {{ earning.amount > 0 ? '+' : '' }}₫{{ earning.amount.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
        <van-tab :title="$t('profile.teamEarnings')" name="team">
          <div class="tab-content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                :finished-text="$t('common.noMore')"
                @load="onLoad"
              >
                <div v-if="teamMembers.length === 0 && !loading" class="empty-state">
                  <van-empty
                    :description="$t('team.noMembers')"
                  />
                </div>
                
                <div v-else class="team-members">
                  <div 
                    v-for="member in teamMembers" 
                    :key="member.id"
                    class="team-member-item"
                  >
                    
                    <div class="member-info">
                      <div class="member-name">{{ member.username }}</div>
                      <div class="member-level">{{ $t(`team.level${member.level}` as any) }}</div>
                      <div class="member-join-date">{{ formatDate(member.joinDate) }}</div>
                    </div>
                    <div class="member-earnings">
                      <div class="earnings-amount">₫{{ member.totalEarnings.toLocaleString() }}</div>
                      <div class="earnings-label">{{ $t('profile.totalEarnings') }}</div>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEarningsStore } from '@/store/modules/earnings'
import { useUserStore } from '@/store/modules/user'
import { $t } from '@/locales'
import { showToast } from 'vant'

const router = useRouter()
const earningsStore = useEarningsStore()
const userStore = useUserStore()

// 响应式数据
const activeTab = ref('task')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const currentPage = ref(1)

// 已移除下拉筛选，保持简单

// 计算属性
const earnings = computed(() => earningsStore.earnings)
const teamMembers = computed(() => earningsStore.teamMembers)
const teamMemberStats = computed(() => earningsStore.teamMemberStats)
const earningsSummary = computed(() => earningsStore.getEarningsSummary())

// 方法
const getEarningIcon = (type: string) => {
  const iconMap = {
    task: 'task-o',
    promotion: 'friends-o',
    bonus: 'gift-o'
  }
  return iconMap[type] || 'gold-coin-o'
}

const getEarningColor = (type: string) => {
  const colorMap = {
    task: '#1890ff',
    promotion: '#52c41a',
    bonus: '#fa8c16'
  }
  return colorMap[type] || '#666'
}

const getEarningTypeName = (type: string) => {
  const nameMap = {
    task: $t('profile.taskEarnings'),
    promotion: $t('profile.promotionEarnings'),
    bonus: $t('profile.bonusEarnings')
  }
  return nameMap[type] || type
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return $t('profile.today')
  } else if (days === 1) {
    return $t('profile.yesterday')
  } else if (days < 7) {
    return `${days}${$t('profile.daysAgo')}`
  } else {
    return date.toLocaleDateString()
  }
}

const handleTabChange = (name: string) => {
  activeTab.value = name
  if (name === 'team') {
    loadTeamData()
  } else {
    loadEarningsData()
  }
}

// 无筛选项

const loadEarningsData = async () => {
  try {
    loading.value = true
    await earningsStore.fetchEarnings('reward')
    finished.value = true
  } catch (error) {
    console.error('加载收益数据失败:', error)
    showToast($t('profile.loadEarningsFailed'))
  } finally {
    loading.value = false
  }
}

const loadTeamData = async () => {
  try {
    loading.value = true
    const response = await earningsStore.fetchMyTeam({ page: 1, limit: 20 })
    
    // 处理团队成员数据
    if (response && Array.isArray(response)) {
      earningsStore.teamMembers = response.map((member: any, idx: number) => ({
        id: member.id || idx + 1,
        username: member.username || member.nickname || '未知用户',
        phone: member.phone || member.mobile || '',
        avatar: member.avatar || '',
        level: member.level || 1,
        joinDate: member.created_at || member.join_date || new Date().toISOString(),
        totalEarnings: Number(member.total_earnings || member.earnings || 0),
        status: member.status === 1 ? 'active' : 'inactive'
      }))
    }
  } catch (error) {
    console.error('加载团队数据失败:', error)
    showToast($t('profile.loadTeamDataFailed'))
  } finally {
    loading.value = false
  }
}

// 保留函数位以便后续扩展（当前未使用）
const getDateRange = (_range: string) => ({ startDate: undefined as string | undefined, endDate: undefined as string | undefined })

const onRefresh = async () => {
  refreshing.value = true
  currentPage.value = 1
  finished.value = false
  
  try {
    if (activeTab.value === 'team') {
      await loadTeamData()
    } else {
      await loadEarningsData()
    }
  } finally {
    refreshing.value = false
  }
}

const onLoad = async () => {
  if (finished.value) return
  
  currentPage.value++
  // 这里可以实现分页加载逻辑
  // 目前API可能不支持分页，所以直接标记为完成
  finished.value = true
}



// 初始化
onMounted(async () => {
  await loadEarningsData()
})
</script>

<style scoped>
.earnings-page {
  background: #ffffff;
  min-height: 100vh;
}

/* 顶部三卡概览 */
.summary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  padding: 6px 6px 8px;
  width: 100%;
}

.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  min-height: 80px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.summary-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  color: #606266;
  margin-bottom: 8px;
}

.summary-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  flex-shrink: 0;
}
.summary-icon.task { background: #eaf4ff; }
.summary-icon.team { background: #ebf7ef; }
.summary-icon.total { background: #fff3e8; }

.summary-label {
  font-size: 13px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-amount {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  text-align: right;
  word-break: break-all;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
}

/* 收益概览 */
.earnings-overview {
  padding: 16px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  color: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

/* 收益分类 */
.earnings-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 16px 16px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.category-amount {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 筛选区域（Tabs） */
.filter-section {
  background: transparent;
  margin: 8px 16px 16px;
}

:deep(.van-tabs__wrap) {
  border-radius: 12px;
}

:deep(.van-tabs__line) {
  height: 3px;
}

.tab-content {
  padding: 16px;
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.team-stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.team-stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.team-stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 收益列表 */
.earnings-list {
  margin: 0 16px;
}

.empty-state {
  padding: 40px 20px;
}

.earnings-items {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.earning-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.earning-item:last-child {
  border-bottom: none;
}

.earning-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.earning-content {
  flex: 1;
}

.earning-description {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 500;
}

.earning-time {
  font-size: 12px;
  color: #999;
}

.earning-amount {
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
}

.earning-amount.positive {
  color: #52c41a;
}

/* 团队成员列表 */
.team-members {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.team-member-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.team-member-item:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  background: #f8f9fa;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.member-level {
  font-size: 12px;
  color: #1890ff;
  background: #e6f7ff;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 4px;
}

.member-join-date {
  font-size: 12px;
  color: #999;
}

.member-earnings {
  text-align: right;
}

.earnings-amount {
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
  margin-bottom: 2px;
}

.earnings-label {
  font-size: 12px;
  color: #666;
}

/* 操作区域（页面内） */
.actions-section {
  padding: 16px;
}

.withdraw-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.3);
}

</style>
