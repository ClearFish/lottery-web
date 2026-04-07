<template>
  <div class="task-submit-page">
    <van-loading v-if="loading" class="loading" />
    
    <div v-else-if="task" class="submit-content">
      <!-- 任务信息回顾 -->
      <div class="task-review">
        <h3>{{ $t('tasks.taskInfo') }}</h3>
        <van-cell-group inset>
          <van-cell :title="$t('tasks.taskName')" :value="task.title" />
          <van-cell :title="$t('tasks.taskReward')" :value="`₫${task.bonus}`" />
          <van-cell :title="$t('tasks.taskRequirements')" :value="task.required" />
        </van-cell-group>
      </div>

      <!-- 提交表单 -->
      <van-form @submit="handleSubmit" class="submit-form">
        <van-cell-group inset>
          <van-cell :title="$t('tasks.completionScreenshots')" required>
            <template #value>
              <van-uploader
                v-model="form.screenshots"
                multiple
                :max-count="5"
                :after-read="afterRead"
                :before-delete="beforeDelete"
                :upload-text="$t('tasks.uploadScreenshots')"
              />
            </template>
          </van-cell>
          
          <van-field
            required
            v-model="form.description"
            name="description"
            :label="$t('tasks.submissionDescription')"
            type="textarea"
            :placeholder="$t('tasks.submissionDescriptionPlaceholder')"
            :rules="[{ required: true, message: $t('tasks.submissionDescriptionRequired') }]"
            rows="4"
            autosize
          />
          
          <van-field
          required
            v-model="form.links"
            name="links"
            :label="$t('tasks.relatedLinks')"
            :placeholder="$t('tasks.relatedLinksPlaceholder')"
            type="url"
          />
          
          <van-field
            v-model="form.notes"
            name="notes"
            :label="$t('tasks.notes')"
            type="textarea"
            :placeholder="$t('tasks.notesPlaceholder')"
            rows="2"
            autosize
          />
        </van-cell-group>

        <div class="submit-actions">
          <van-button 
            type="primary" 
            size="large" 
            block 
            :loading="submitting"
            native-type="submit"
          >
            {{ $t('tasks.submitTask') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/store/modules/task'
import { showToast, showConfirmDialog } from 'vant'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()

const loading = ref(false)
const submitting = ref(false)
const taskId = ref<number | null>(null)

const form = reactive({
  screenshots: [] as any[],
  description: '',
  links: '',
  notes: ''
})

const task = ref(taskStore.currentTask)

const afterRead = (file: any) => {
  // 处理文件上传
  console.log('上传文件:', file)
}

const beforeDelete = (file: any, detail: any) => {
  return new Promise<boolean>((resolve) => {
    showConfirmDialog({
      title: $t('tasks.confirmDelete'),
      message: $t('tasks.confirmDeleteMessage')
    }).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    })
  })
}

const handleSubmit = async () => {
  if (form.screenshots.length === 0) {
    showToast($t('tasks.uploadScreenshotRequired'))
    return
  }

  if (!form.description.trim()) {
    showToast($t('tasks.descriptionRequired'))
    return
  }

  submitting.value = true
  try {
    // 调用真实的提交任务API
    const { submitMission } = await import('@/api/mission')
    
    // 取第一张截图作为提交文件
    const firstScreenshot = form.screenshots[0]
    const file = firstScreenshot.file || firstScreenshot.content

    
    await submitMission({
      id: taskId.value!, // 使用路由参数中的 task.id
      file: file,
      video_url: form.links || undefined
    })

    
    showToast($t('tasks.submitSuccess'))
    router.push({ name: 'MyTasks' })
  } catch (error) {
    console.error('提交任务失败:', error)
    showToast(error.msg || $t('tasks.submitFailed'))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  taskId.value = parseInt(route.params.id as string)
  const missionId = parseInt(route.query.mission_id as string)
  
  if (taskId.value && missionId) {
    loading.value = true
    try {
      // 使用 mission_id 获取任务详情信息
      await taskStore.fetchTaskDetail(missionId)
      task.value = taskStore.currentTask
      
      // 如果仍然没有任务数据，显示错误
      if (!task.value) {
        showToast($t('tasks.taskNotFound'))
        router.back()
      }
    } catch (error) {
      console.error('加载任务信息失败:', error)
      showToast(error.msg || $t('tasks.loadTaskFailed'))
      router.back()
    } finally {
      loading.value = false
    }
  } else {
    showToast($t('tasks.invalidTaskId'))
    router.back()
  }
})
</script>

<style scoped>
.task-submit-page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.submit-content {
  padding: 16px;
}

.task-review {
  margin-bottom: 20px;
}

.task-review h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.submit-form {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.submit-actions {
  margin-top: 20px;
}

:deep(.van-uploader__upload) {
  background: #f7f8fa;
  border: 1px dashed #dcdee0;
}

:deep(.van-uploader__preview-image) {
  border-radius: 8px;
}
</style>
