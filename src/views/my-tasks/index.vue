<template>
  <div class="my-tasks-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">{{ $t('tasks.myTasks') }}</h2>
      <p class="page-subtitle">{{ $t('myTasks.subtitle') }}</p>
    </div>

    <!-- 任务统计 -->
    <div class="task-stats">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ taskStats.total }}</div>
          <div class="stat-label">{{ $t('myTasks.totalTasks') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ taskStats.completed }}</div>
          <div class="stat-label">{{ $t('tasks.completed') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ taskStats.pending }}</div>
          <div class="stat-label">{{ $t('myTasks.inProgress') }}</div>
        </div>
      </div>
    </div>

    <!-- 任务筛选 -->
    <div class="task-filters">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <!-- <van-tab title="全部" name="all"></van-tab> -->
        <van-tab :title="$t('myTasks.pendingSubmit')" name="pending"></van-tab>
        <!-- <van-tab title="已提交" name="submitted"></van-tab> -->
        <van-tab :title="$t('tasks.pending')" name="reviewing"></van-tab>
        <van-tab :title="$t('myTasks.approved')" name="approved"></van-tab>
        <van-tab :title="$t('tasks.rejected')" name="rejected"></van-tab>
      </van-tabs>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('myTasks.noMore')"
          @load="onLoad"
        >
          <div
            v-for="task in taskList"
            :key="task.id"
            class="task-item"
            @click="goToTaskDetail(task.mission_id)"
          >
            <div class="task-header">
              <h3 class="task-title">{{ task.title }}</h3>
              <div class="task-reward">₫{{ task.reward }}</div>
            </div>
            <div class="task-content">
              <p class="task-description">{{ task.description }}</p>
             
            </div>
            <div class="task-footer">
              <div class="task-status">
                <span :class="['status-badge', `s-${task.statusNum}`]">
                  {{ getStatusText(task.statusNum) }}
                </span>
              </div>
              <div class="task-time">
                {{ formatTime(task.createdAt) }}
              </div>
            </div>
            <div class="task-actions">
              <van-button 
                v-if="task.statusNum === 0 && task.can_submit === 1"
                type="success" 
                size="small"
                @click.stop="goToSubmitTask(task.id, task.mission_id)"
              >
                {{ $t('myTasks.submitTask') }}
              </van-button>
              <van-button 
                v-if="task.statusNum === 0"
                type="danger" 
                size="small"
                @click.stop="handleCancelTask(task.id)"
                :loading="cancellingTaskId === task.id"
              >
                {{ $t('myTasks.cancelTask') }}
              </van-button>
              <van-button 
                v-if="task.statusNum !== 0 || task.can_submit !== 1"
                type="default" 
                size="small"
                @click.stop="goToTaskDetail(task.mission_id)"
              >
                {{ $t('myTasks.viewDetails') }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/store/modules/task'
import { showToast, showConfirmDialog } from 'vant'
import { $t } from '@/locales'
import { cancelMission } from '@/api/service'

const router = useRouter()
const taskStore = useTaskStore()

const activeTab = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const isInitialized = ref(false)

const taskList = ref<any[]>([])
const taskStats = reactive({
  total: 0,
  completed: 0,
  pending: 0
})
const cancellingTaskId = ref<number | null>(null)

// 获取状态文本
const getStatusText = (statusNum: number) => {
  const map: Record<number, string> = {
    0: $t('myTasks.statusPending'),
    // 1: $t('myTasks.statusSubmitted'),
    2: $t('myTasks.statusReviewing'),
    3: $t('myTasks.statusApproved'),
    4: $t('myTasks.statusRejected')
  }
  return map[statusNum] || String(statusNum)
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// 标签页切换
const handleTabChange = (name: string) => {
  activeTab.value = name
  loadTasks(true) // 强制刷新，获取新状态的数据
}

// 加载任务列表
const loadTasks = async (force = false) => {
  // 防止重复请求
  if (loading.value && !force) return
  
  try {
    loading.value = true
    const { getReceiveList } = await import('@/api/mission')
    const statusParam = activeTab.value === 'all' ? undefined
      : activeTab.value === 'pending' ? 0      // 待提交
      : activeTab.value === 'submitted' ? 1    // 已提交
      : activeTab.value === 'reviewing' ? 2    // 待审核
      : activeTab.value === 'approved' ? 3     // 审核通过
      : activeTab.value === 'rejected' ? 4     // 审核拒绝
      : undefined
    const res = await getReceiveList({ pageIndex: 1, status: statusParam as any }) as any
    const rows = res?.rows || []
    taskList.value = rows.map((r: any) => ({
      id: r.id,
      mission_id: r.mission_id,
      title: r.title,
      reward: Number(r.bonus || 0),
      description: r.remark || '',
      tags: Object.values(r.keywords || {}),
      statusNum: Number(r.status ?? 0),
      can_submit: Number(r.can_submit ?? 0),
      order_number: r.order_number,
      createdAt: r.created_at || new Date().toISOString()
    }))
    
    // 使用API返回的统计数据
    if (res?.report) {
      taskStats.total = res.report.total || 0
      taskStats.completed = res.report.finished || 0
      taskStats.pending = res.report.inprogress || 0
    } else {
      // 如果没有report数据，使用本地计算
      updateTaskStats()
    }
    
    isInitialized.value = true
  } catch (error) {
    showToast(error.msg || $t('myTasks.loadFailed'))
  } finally {
    loading.value = false
  }
}

// 更新任务统计（备用方法，当API没有返回report数据时使用）
const updateTaskStats = () => {
  const tasks: any[] = taskList.value
  taskStats.total = tasks.length
  taskStats.pending = tasks.filter(t => t.statusNum === 0 || t.statusNum === 1 || t.statusNum === 2).length
  taskStats.completed = tasks.filter(t => t.statusNum === 3).length
}

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  await loadTasks(true) // 强制刷新
  refreshing.value = false
}

// 上拉加载
const onLoad = async () => {
  // 上拉加载时不需要重新请求，因为数据已经在页面加载时获取了
  finished.value = true
}

// 跳转到任务详情（根据 status 设置详情页动作）
const goToTaskDetail = (mission_id: number) => {
  const item: any = taskList.value.find(t => t.mission_id === mission_id)
  const status = Number(item?.statusNum ?? 0)  // s: 状态(0:待提交,1:已提交,2:待审核,3:审核通过,4:审核拒绝)
  const canSubmit = Number(item?.can_submit ?? 0)  // cs: 判断是否显示"去完成任务"按钮
  const taskId = item?.id  // 我的任务中的任务ID
  
  router.push({ 
    name: 'TaskDetail', 
    params: { id: mission_id }, 
    query: { s: status, cs: canSubmit, task_id: taskId }
  })
}

// 跳转到提交任务页面
const goToSubmitTask = (taskId: number, missionId: number) => {
  router.push({ 
    name: 'TaskSubmit', 
    params: { id: taskId },
    query: { mission_id: missionId }
  })
}

// 取消任务
const handleCancelTask = async (taskId: number) => {
  try {
    await showConfirmDialog({
      title: $t('myTasks.cancelTaskConfirm'),
      message: $t('myTasks.cancelTaskMessage')
    })
    
    cancellingTaskId.value = taskId
    
    const res = await cancelMission({ id: taskId })
    showToast($t('myTasks.cancelTaskSuccess'))
      // 重新加载任务列表
      await loadTasks(true)
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消任务失败:', error)
      showToast(error?.msg || $t('myTasks.cancelTaskFailed'))
    }
  } finally {
    cancellingTaskId.value = null
  }
}

// 页面初始化
onMounted(() => {
  if (!isInitialized.value) {
    loadTasks()
  }
})
</script>

<style scoped>
.my-tasks-page {
  padding-bottom: 60px;
}

.page-header {
  padding: 20px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.task-stats {
  display: flex;
  padding: 16px;
  gap: 12px;
  background: white;
}

.stat-card {
  flex: 1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.task-filters {
  background: white;
  margin-bottom: 8px;
}

.task-list {
  background: white;
}

.task-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.task-item:last-child {
  border-bottom: none;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.task-reward {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b35;
}

.task-content {
  margin-bottom: 12px;
}

.task-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.task-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.task-tag {
  background: #f0f0f0;
  color: #666;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
}

.task-time {
  font-size: 12px;
  color: #999;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* 状态徽章样式 - 基于数值状态 */
.status-badge.s-0 {
  background: #fff3cd;
  color: #856404;
}

.status-badge.s-1 {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.s-2 {
  background: #fff3cd;
  color: #856404;
}

.status-badge.s-3 {
  background: #d4edda;
  color: #155724;
}

.status-badge.s-4 {
  background: #f8d7da;
  color: #721c24;
}

/* 保留原有的文字状态样式作为备用 */
.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.reviewed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.task-time {
  font-size: 12px;
  color: #999;
}
</style>
