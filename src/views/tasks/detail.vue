<template>
  <div class="task-detail-page">
    <van-loading v-if="loading" class="loading" />
    
    <div v-else-if="!task" class="error-content">
      <van-empty :description="$t('tasks.taskNotFound')" />
      <van-button type="primary" @click="router.back()">{{ $t('common.back') }}</van-button>
    </div>
    
    <div v-else class="task-content">
      <!-- 任务头部信息 -->
      <div class="task-header">
        <h1 class="task-title">{{ task.title }}</h1>
        <div class="task-reward">₫{{ task.bonus }}</div>
      </div>

      <!-- 任务基本信息 -->
      <van-cell-group inset>
        <van-cell :title="$t('tasks.taskCount')" :value="`${task.counts}`" />
        <van-cell :title="$t('tasks.remainingCount')" :value="`${task.left_counts}`" />
        <van-cell v-if="task.level > 0" :title="$t('tasks.levelRequirement')" :value="`${$t('tasks.needLevel')} ${task.level} ${$t('tasks.above')}`" />
      </van-cell-group>

       <!-- require_content -->
       <div v-if="task?.require_content && task?.require_content.length" class="task-requirements">
        <!-- <h3>{{ $t('tasks.requireContent') }}</h3> -->
        <div class="keywords-list">
          <span
            v-for="(content, index) in task?.require_content"
            :key="index"
            class="keyword-tag"
            @click="copyText(content)"
          >
            {{ content }}
          </span>
        </div>
      </div>

      <!-- 任务描述 -->
      <div class="task-description">
        <h3>{{ $t('tasks.taskDescription') }}</h3>
        <div 
          ref="taskRemarkRef"
          v-html="task.remark"
          @click="handleHtmlClick"
        ></div>
      </div>

      <!-- 任务要求 -->
      <div class="task-requirements">
        <h3>{{ $t('tasks.taskRequirements') }}</h3>
        <div 
          ref="taskRequiredRef"
          v-html="task.required"
          @click="handleHtmlClick"
        ></div>
      </div>

     

      <!-- 关键词 -->
      <div v-if="task?.keywords && Object.keys(task?.keywords).length > 0" class="task-keywords">
        <h3>{{ $t('tasks.keywords') }}</h3>
        <div class="keywords-list">
          <span 
            v-for="(keyword, key) in task?.keywords" 
            :key="key" 
            class="keyword-tag"
            @click="copyKeyword(keyword)"
          >
            {{ keyword }}
          </span>
        </div>
      </div>

      <!-- 视频素材 -->
      <div v-if="task.video_url" class="task-materials">
        <h3>{{ $t('tasks.taskMaterials') }}</h3>
        <div class="materials-section">
          <h4>{{ $t('tasks.videoMaterials') }}</h4>
          <div class="video-item">
            <video :src="task.video_url" controls class="video-preview"></video>
            <van-button size="small" type="primary" @click="downloadVideo(task.video_url)">
              {{ $t('tasks.downloadVideo') }}
            </van-button>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="task-actions">
        <van-button 
          v-if="taskStatus === 'available'"
          type="primary" 
          size="large" 
          block
          :disabled="task.left_counts === 0 || !canClaimTask"
          @click="handleClaimTask"
        >
          {{ task.left_counts === 0 ? $t('tasks.taskFull') : !canClaimTask ? $t('tasks.levelInsufficient') : $t('tasks.claimNow') }}
        </van-button>
        
        <van-button 
          v-else-if="taskStatus === 'pending'"
          type="success" 
          size="large" 
          block
          @click="goToSubmit"
        >
          {{ $t('tasks.goToComplete') }}
        </van-button>
        
        <van-button 
          v-else-if="taskStatus === 'in_progress'"
          type="warning" 
          size="large" 
          block
          disabled
        >
          {{ $t('tasks.waitingReview') }}
        </van-button>
        
        <van-button 
          v-else-if="taskStatus === 'completed'"
          type="default" 
          size="large" 
          block
          disabled
        >
          {{ $t('tasks.taskCompleted') }}
        </van-button>
        
        <van-button 
          v-else-if="taskStatus === 'rejected'"
          type="danger" 
          size="large" 
          block
          disabled
        >
          {{ $t('tasks.taskRejected') }}
        </van-button>
      </div>
    </div>

    <!-- 图片预览 -->
    <van-image-preview v-model:show="showImagePreview" :images="previewImages" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/store/modules/task'
import { showToast } from 'vant'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()

const loading = ref(false)
const showImagePreview = ref(false)
const previewImages = ref<string[]>([])
const taskRequiredRef = ref<HTMLElement>()
const taskRemarkRef = ref<HTMLElement>()

const task = computed(() => {
  console.log('Current task data:', taskStore.currentTask)
  return taskStore.currentTask
})
const canSubmit = computed(() => Number(route.query.cs ?? 0) === 1)

const taskStatus = computed(() => {
  // 优先读取路由 query 的状态（来自我的任务列表）
  const s = Number(route.query.s ?? NaN)
  if (!Number.isNaN(s)) {
    // 来自"我的任务"页面的状态参数
    // s = status: 0:待提交, 1:已提交, 2:待审核, 3:审核通过, 4:审核拒绝
    // canSubmit: 判断是否显示"去完成任务"按钮
    if (s === 0) return 'pending'  // 待提交
    if (s === 1) return canSubmit.value ? 'in_progress' : 'completed'  // 已提交，根据canSubmit判断
    if (s === 2) return 'in_progress'  // 待审核
    if (s === 3) return 'completed'  // 审核通过
    if (s === 4) return 'rejected'  // 审核拒绝
  }
  
  // 如果没有状态参数，说明来自任务中心页面
  // 任务中心的任务都是可领取状态
  if (!task.value) return 'available'
  
  // 检查任务是否已被领取（通过store中的myTasks判断）
  const userTask = taskStore.myTasks.find(ut => ut.taskId === task.value!.id)
  if (userTask) {
    // 如果任务已被领取，根据用户任务状态判断
    switch (userTask.status) {
      case 'pending': return 'pending'
      case 'in_progress': return 'in_progress'
      case 'completed': return 'completed'
      case 'abandoned': return 'available'
      case 'rejected': return 'available'
      default: return 'available'
    }
  }
  
  // 默认返回可领取状态
  return 'available'
})

// 检查是否可以领取任务（等级限制）
const canClaimTask = computed(() => {
  if (!task.value) return false
  // 如果level为0，表示无限制
  if (task.value.level === 0) return true
  // TODO: 这里需要获取用户当前等级，暂时返回true
  // const userLevel = getUserLevel()
  // return userLevel >= task.value.level
  return true
})

const handleClaimTask = async () => {
  if (!task.value) return
  
  try {
    const { receiveMission } = await import('@/api/mission')
    const res = await receiveMission({ id: task.value.id })
    showToast($t('tasks.claimSuccess'))
    goToSubmit(res.id);
  } catch (error) {
    console.error('Claim task failed:', error)
    showToast(error.msg || $t('tasks.claimFailed'))
  }
}

const goToSubmit = (taskId: number) => {
  if (task.value) {
    // 检查是否有从"我的任务"页面传递过来的任务ID
    const myTaskId = route.query.task_id as string
    const submitTaskId = myTaskId || taskId
    
    router.push({ 
      name: 'TaskSubmit', 
      params: { id: submitTaskId },
      query: { mission_id: task.value.id }
    })
  }
}

const downloadVideo = (url: string) => {
  showToast($t('tasks.videoDownloadDeveloping'))
}

const downloadImage = (url: string) => {
  showToast($t('tasks.imageDownloadDeveloping'))
}

// 复制关键词
const copyKeyword = async (keyword: string) => {
  try {
    await navigator.clipboard.writeText(keyword)
    showToast($t('tasks.keywordCopied' as any))
  } catch (error) {
    // 降级方案：使用传统方法
    const textArea = document.createElement('textarea')
    textArea.value = keyword
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('tasks.keywordCopied' as any))
  }
}

// 处理HTML内容中的点击事件（通用方法）
const handleHtmlClick = (event: Event) => {
  const target = event.target as HTMLElement
  
  // 检查是否是data-copy="true"的元素
  if (target.getAttribute('data-copy') === 'true') {
    // 优先使用link属性，如果没有则使用文本内容
    const linkValue = target.getAttribute('link')
    const textToCopy = linkValue || target.textContent || target.innerText
    
    if (textToCopy) {
      copyText(textToCopy)
    }
    return
  }
  
  // 检查是否是data-game="true"的元素，或者其子元素
  let gameElement = target
  if (target.getAttribute('data-game') !== 'true') {
    // 如果点击的是子元素（如图片），向上查找父级data-game元素
    gameElement = target.closest('[data-game="true"]') as HTMLElement
  }
  
  if (gameElement && gameElement.getAttribute('data-game') === 'true') {
    const gameName = gameElement.getAttribute('game_name')
    const gameCode = gameElement.getAttribute('game_code')
    const gameListId = gameElement.getAttribute('game_list_id')
    const title = gameElement.getAttribute('title') || gameName
    
    if (gameName && gameCode && gameListId) {
      // 跳转到游戏页面
      router.push({
        name: 'Game',
        query: {
          game_name: gameName,
          game_code: gameCode,
          game_list_id: gameListId,
          title: title
        }
      })
    } else {
      showToast($t('tasks.gameInfoIncomplete' as any))
    }
    return
  }
}

// 复制文本的通用方法
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast($t('tasks.textCopied' as any))
  } catch (error) {
    // 降级方案：使用传统方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('tasks.textCopied' as any))
  }
}

const previewImage = (image: string) => {
  previewImages.value = [image]
  showImagePreview.value = true
}

onMounted(async () => {
  const taskId = parseInt(route.params.id as string)
  if (!taskId) {
    showToast($t('tasks.invalidTaskId'))
    return
  }
  
  loading.value = true
  try {
    console.log('taskId:', route.params.id)
    let receive_id = 0;
    let type = 1;
    if (route.query.task_id) {
      receive_id = parseInt(route.query.task_id as string)
      console.log('receive_id:', receive_id)
    }

    if(route.query.cs||route.query.cs=='0'){ 
      type = 2
      console.log('type:', type)
    }

    // 每次都调用API获取最新的任务详情
    await taskStore.fetchTaskDetail(taskId,receive_id,type)
    
    // 如果仍然没有任务数据，显示错误但不返回
    if (!task.value) {
      showToast($t('tasks.taskNotFound'))
    }
  } catch (error) {
    console.error('加载任务详情失败:', error)
    showToast(error.msg || $t('tasks.loadTaskDetailFailed'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.task-detail-page {
  padding-bottom: 80px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
}

.task-content {
  padding: 16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.task-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  margin-right: 16px;
}

.task-reward {
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
}

.task-description,
.task-requirements,
.task-keywords,
.task-materials {
  margin: 20px 0;
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.task-description h3,
.task-requirements h3,
.task-keywords h3,
.task-materials h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.task-description p,
.task-description div {
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.task-requirements pre,
.task-requirements div {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #666;
  margin: 0;
  font-family: inherit;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.keyword-tag:hover {
  background: #bae7ff;
  transform: scale(1.05);
}

.keyword-tag:active {
  transform: scale(0.95);
  background: #91d5ff;
}

/* 任务描述和任务要求中的可点击元素样式 */
.task-description [data-copy="true"],
.task-description [data-game="true"],
.task-requirements [data-copy="true"],
.task-requirements [data-game="true"] {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 2px;
  display: inline-block;
  text-decoration: none;
}

.task-description [data-copy="true"]:hover,
.task-description [data-game="true"]:hover,
.task-requirements [data-copy="true"]:hover,
.task-requirements [data-game="true"]:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.task-description [data-copy="true"]:active,
.task-description [data-game="true"]:active,
.task-requirements [data-copy="true"]:active,
.task-requirements [data-game="true"]:active {
  transform: scale(0.95);
  background-color: #e0e0e0;
}

/* 复制元素特殊样式 */
.task-description [data-copy="true"],
.task-requirements [data-copy="true"] {
  color: #1890ff !important;
  font-weight: bold;
  border: 1px solid #d9d9d9;
}

.task-description [data-copy="true"]:hover,
.task-requirements [data-copy="true"]:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff !important;
}

/* 游戏元素特殊样式 */
.task-description [data-game="true"],
.task-requirements [data-game="true"] {
  color: #52c41a;
  font-weight: bold;
  border: 1px solid #d9d9d9;
  display: inline-block;
}

.task-description [data-game="true"]:hover,
.task-requirements [data-game="true"]:hover {
  background-color: #f6ffed;
  border-color: #52c41a;
}

/* 游戏元素内的图片样式 */
.task-description [data-game="true"] img,
.task-requirements [data-game="true"] img {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.task-description [data-game="true"]:hover img,
.task-requirements [data-game="true"]:hover img {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

.task-description [data-game="true"]:active img,
.task-requirements [data-game="true"]:active img {
  transform: scale(0.95);
}

.materials-section {
  margin: 16px 0;
}

.materials-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.video-list,
.image-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-item,
.image-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-preview {
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.image-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.task-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}
</style>
