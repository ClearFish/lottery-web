<template>
  <div class="tasks-page">
    <!-- 筛选器 -->
    <div class="task-filter">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <van-tab v-for="c in categories" :key="c.id" :name="c.id" >
          <template #title>
            <div class="tab_con">
              <img :src="c.icon" alt="" class="title_icon">
              <p>{{ c.title }}</p>
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('common.noMore')"
          @load="onLoad"
        >
          <TaskCard
            v-for="task in taskList"
            :key="task.id"
            :task="task"
            :task-status="getTaskStatus(task.id)"
            @claim="handleClaimTask"
            @click="goToTaskDetail"
          />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 空状态 -->
    <van-empty 
      v-if="!loading && taskList.length === 0" 
      :description="$t('tasks.noTasks')"
      image="search"
    />

    <!-- 浮动任务大厅按钮 -->
    <!-- <div class="floating-task-hall-button" @click="goToTaskHall">
      <div class="task-hall-button-content">
        <van-icon 
          name="apps-o" 
          size="16" 
          class="task-hall-icon"
        />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import TaskCard from '@/components/TaskCard/index.vue'
import { getMissionCategoryList, getMissionList, receiveMission } from '@/api/mission'
import { useTaskStore } from '@/store/modules/task'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()
const activeTab = ref<number>(0)
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

const categories = ref<Array<{ id: number; title: string,icon:string }>>([])
const taskList = ref<any[]>([])
const taskStore = useTaskStore()

const handleTabChange = (name: number) => {
  activeTab.value = name
  loadTasks()
}

const loadTasks = async () => {
  loading.value = true
  try {
    const cid = activeTab.value
    const res = await getMissionList({ pageIndex: 1, cid: cid as any })
    // 适配到 TaskCard 所需字段
    taskList.value = (res as any)?.rows?.map((item: any) => ({
      id: item.id,
      title: item.title,
      bonus: Number(item.bonus || 0),
      left_counts: item.left_counts,
      required: item.required || item.remark || '',
      keywords: Object.values(item.keywords || {}),
      remainingCount: item.left_counts ?? 0,
      difficulty: (item.level && item.level >= 2) ? 'hard' : (item.level === 1 ? 'medium' : 'easy')
    })) || []
  } catch (error) {
    showToast(error.msg || $t('tasks.loadFailed'))
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  // TODO: 实现分页加载
  finished.value = true
}

const onRefresh = async () => {
  refreshing.value = true
  await loadTasks()
  refreshing.value = false
}

const handleClaimTask = async (taskId: number) => {
  try {
    const res = await receiveMission({ id: taskId })
    showToast($t('tasks.claimSuccess'))
    if(res) {
      router.push({ 
        name: 'TaskDetail', 
        params: { id: res.mission_id }, 
        query: { s: status, cs: res.can_submit, task_id: res.id }
      })
    }
   
    // 更新任务状态
    const task = taskList.value.find(t => t.id === taskId)
    if (task) {
      task.remainingCount--
    }
  } catch (error) {
    showToast(error.msg || $t('tasks.claimFailed'))
  }
}

const goToTaskDetail = (taskId: number) => {
  const item = taskList.value.find(t => t.id === taskId)
  if (item) {
    // 映射到 Task 结构
    const taskPayload = {
      id: item.id,
      name: item.name || item.title || '',
      category: 'douyin',
      reward: Number(item.reward ?? 0),
      totalCount: Number(item.totalCount ?? item.counts ?? 0),
      remainingCount: Number(item.remainingCount ?? item.left_counts ?? 0),
      keywords: Array.isArray(item.keywords) ? item.keywords : Object.values(item.keywords || {}),
      description: item.description || item.remark || '',
      requirements: item.requirements || item.required || '',
      materials: {
        videos: item.video_url ? [item.video_url] : [],
        images: Array.isArray(item.images) ? item.images : []
      },
      difficulty: item.difficulty || 'easy',
      estimatedTime: Number(item.estimatedTime ?? 30),
      status: 'active',
      createdAt: new Date().toISOString()
    }
    taskStore.currentTask = taskPayload as any
    // 任务中心页面不传递s和cs参数，让详情页自己判断状态
    router.push({ name: 'TaskDetail', params: { id: taskId } })
    return
  }
  router.push({ name: 'TaskDetail', params: { id: taskId } })
}

const getTaskStatus = (_taskId: number) => {
  return ''
}

// 跳转到任务大厅
const goToTaskHall = () => {
  router.push({ name: 'GameHall' })
}

onMounted(() => {
  // 加载分类
  getMissionCategoryList().then((res: any) => {
    categories.value = res?.rows || []
    // 设置默认选择第一个分类
    if (categories.value.length > 0) {
      activeTab.value = categories.value[0].id
    }
  }).finally(() => {
    // 根据路由参数设置分类（如果有的话）
    const cid = Number(route.query.cid)
    if (cid && categories.value.some(c => c.id === cid)) {
      activeTab.value = cid
    }
    loadTasks()
  })
})
</script>

<style scoped>
.tasks-page {
  padding-bottom: 60px;
}

.task-filter {
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: 10px;
}

.tab_con {
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.task-filter .title_icon {
  width: 14px;
  height: 14px;
}
.task-list {
  padding: 0 16px;
}

:deep(.van-tabs__line) {
  background: #1890ff;
}

:deep(.van-tab--active) {
  color: #1890ff;
}

/* 浮动任务大厅按钮样式 */
.floating-task-hall-button {
  position: fixed;
  width: 24px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px 0 0 12px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: 70%;
  transform: translateY(-50%);
}

.floating-task-hall-button:hover {
  width: 28px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.floating-task-hall-button:active {
  transform: translateY(-50%) scale(0.98);
}

.task-hall-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.task-hall-icon {
  color: white;
  transition: all 0.3s ease;
}
</style>
