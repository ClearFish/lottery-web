<template>
  <div class="team-page">
    <!-- 团队统计 -->
    <!-- <div class="team-stats">
      <div class="stats-cards">
        <div class="stats-card">
          <div class="card-icon">
            <van-icon name="friends-o" size="24" color="#1890ff" />
          </div>
          <div class="card-content">
            <div class="card-value">{{ teamStats.totalMembers }}</div>
            <div class="card-label">{{ $t('team.totalMembers') }}</div>
          </div>
        </div>
        <div class="stats-card">
          <div class="card-icon">
            <van-icon name="user-o" size="24" color="#52c41a" />
          </div>
          <div class="card-content">
            <div class="card-value">{{ teamStats.level1Members }}</div>
            <div class="card-label">{{ $t('team.level1Members') }}</div>
          </div>
        </div>
        <div class="stats-card">
          <div class="card-icon">
            <van-icon name="gold-coin-o" size="24" color="#ff6b35" />
          </div>
          <div class="card-content">
            <div class="card-value">₫{{ teamStats.totalEarnings }}</div>
            <div class="card-label">{{ $t('team.teamEarnings') }}</div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 筛选器 -->
    <div class="filter-section">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <van-tab :title="$t('common.all')" name="all" />
        <van-tab :title="$t('team.level1')" name="1" />
        <van-tab :title="$t('team.level2')" name="2" />
        <van-tab :title="$t('team.level3')" name="3" />
      </van-tabs>
    </div>

    <!-- 团队成员列表 -->
    <div class="members-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('common.noMore')"
          @load="onLoad"
        >
          <div 
            v-for="member in filteredMembers" 
            :key="member.player_id"
            class="member-item"
          >
            <div class="member-info">
              <div class="member-name">{{ member.username || member.nickname }}</div>
              <div class="member-details">
                <span class="member-level">L{{ level }}</span>
                <span class="member-join-date">{{ formatDate(member.jointime) }}</span>
              </div>
            </div>
            <div class="member-stats">
              <div class="member-earnings">₫{{ member.commission || 0 }}</div>
              <div class="member-status" :class="`status-${member.mission_count > 0 ? 'active' : 'inactive'}`">
                {{ getStatusText(member.mission_count > 0 ? 'active' : 'inactive') }}
              </div>
              <van-button 
                v-if="member.player_name"
                type="primary" 
                size="mini"
                class="chat-btn"
                @click="handleChat(member.player_name)"
              >
                {{ $t('team.chat') }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 空状态 -->
    <van-empty 
      v-if="!loading && filteredMembers.length === 0" 
      :description="$t('team.noMembers')"
      image="friends-o"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamList } from '@/api/mission'
import { $t } from '@/locales'

const router = useRouter()
const activeTab = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

const members = ref<any[]>([])

// 当前选择的级别
const level = computed(() => {
  return activeTab.value === 'all' ? 1 : parseInt(activeTab.value)
})

const teamStats = computed(() => {
  const totalMembers = members.value.length
  const totalEarnings = members.value.reduce((sum, member) => sum + (member.commission || 0), 0)

  return {
    totalMembers,
    level1Members: 0,
    level2Members: 0,
    level3Members: 0,
    totalEarnings
  }
})

const filteredMembers = computed(() => {
  // 直接返回所有成员，因为接口已经按级别返回了
  return members.value
})

const getStatusText = (status: string) => {
  const statusMap = {
    active: $t('team.active'),
    inactive: $t('team.inactive')
  }
  return statusMap[status] || status
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

// 处理对话按钮点击
const handleChat = (player_name: string) => {
  if (!player_name) {
    console.error('identification 为空')
    return
  }
  // 跳转到聊天页面，传递 domain 和 isChat 参数
  router.push({
    name: 'Chat',
    query: {
      domain: player_name,
      isChat: 'true'
    }
  })
}

const handleTabChange = async (name: string) => {
  activeTab.value = name
  // 切换tab时重新请求接口
  await onRefresh()
}

const onLoad = () => {
  // TODO: 实现分页加载
  finished.value = true
}

const onRefresh = async () => {
  refreshing.value = true
  try {
    // 选择"全部"时使用 level 1，选择具体级别时使用对应级别
    const currentLevel = (activeTab.value === 'all' ? 1 : parseInt(activeTab.value)) as 1 | 2 | 3
    const res = await getTeamList({ pageIndex: 1, level: currentLevel }) as any
    // res 已经是 data 了，直接使用 res.rows，不进行映射
    members.value = res?.rows || []
  } catch (error) {
    console.error('刷新团队成员失败:', error)
  } finally {
    refreshing.value = false
  }
}

onMounted(() => {
  onRefresh()
})
</script>

<style scoped>
.team-page {
  padding-bottom: 60px;
}

.team-stats {
  padding: 16px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-card .card-icon {
  margin-bottom: 8px;
}

.stats-card .card-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stats-card .card-label {
  font-size: 12px;
  color: #666;
}

.filter-section {
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.members-list {
  padding: 16px;
}

.member-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
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

.member-phone {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.member-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.member-level {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.member-join-date {
  color: #666;
}

.member-stats {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.member-earnings {
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
}

.member-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.chat-btn {
  margin-top: 4px;
}

.status-active {
  background: #e8f5e8;
  color: #52c41a;
}

.status-inactive {
  background: #f0f0f0;
  color: #999;
}

:deep(.van-tabs__line) {
  background: #1890ff;
}

:deep(.van-tab--active) {
  color: #1890ff;
}
</style>
