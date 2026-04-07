import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Task {
  id: number
  title: string
  bonus: string
  counts: number
  left_counts: number
  keywords: Record<string, string>
  require_content?: string[] | string | null
  video_url: string
  required: string
  remark: string
  level: number
}

// 任务详情页面的数据类型
export interface TaskDetail {
  id: number
  title: string
  bonus: string
  counts: number
  left_counts: number
  keywords: Record<string, string>
  require_content?: string[] | string | null
  video_url: string
  required: string
  remark: string
  level: number
}

export interface UserTask {
  id: number
  taskId: number
  taskName: string
  category: string
  reward: number
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned' | 'rejected'
  claimedAt: string
  completedAt?: string
  submissionData?: any
}

export const useTaskStore = defineStore('task', () => {
  // 状态
  const taskList = ref<Task[]>([])
  const myTasks = ref<UserTask[]>([])
  const currentTask = ref<TaskDetail | null>(null)
  const loading = ref(false)

  // 方法
  const fetchTaskList = async (category?: string) => {
    loading.value = true
    try {
      // 已由页面直接调用真实任务接口，这里保留空实现或按需接入
      taskList.value = []
    } catch (error) {
      console.error('获取任务列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTaskDetail = async (taskId: number,receive_id?: number,type?: number) => {
    loading.value = true
    try {
      // 直接调用API获取最新的任务详情
      const { getMissionInfo } = await import('@/api/mission')
      const response = await getMissionInfo({ id: taskId, receive_id,type })
      
      console.log('API响应:', response)
      
      if (response) {
        console.log('设置任务数据:', response)
        currentTask.value = response as unknown as TaskDetail
        console.log('设置后的currentTask:', currentTask.value)
      } else {
        console.log('API返回数据无效:', response)
        currentTask.value = null
      }
    } catch (error) {
      console.error('获取任务详情失败:', error)
      currentTask.value = null
    } finally {
      loading.value = false
    }
  }

  const claimTask = async (taskId: number) => {
    try {
      // 页面已直接使用 receiveMission，这里只做本地状态更新
      const task = taskList.value.find(t => t.id === taskId)
      if (task && task.left_counts > 0) {
        task.left_counts--
      }
      
      const userTask: UserTask = {
        id: Date.now(),
        taskId: taskId,
        taskName: task?.title || '',
        category: '', // 新API结构中没有category字段
        reward: parseFloat(task?.bonus || '0'),
        status: 'pending',
        claimedAt: new Date().toISOString()
      }
      
      myTasks.value.push(userTask)
      return userTask
    } catch (error) {
      console.error('领取任务失败:', error)
      throw error
    }
  }

  const submitTask = async (taskId: number, submissionData: any) => {
    try {
      // 调用真实的提交任务API
      const { submitMission } = await import('@/api/mission')
      
      const firstScreenshot = submissionData.screenshots?.[0]
      const file = firstScreenshot?.file || firstScreenshot?.content
      
      const response = await submitMission({
        id: taskId,
        file: file,
        video_url: submissionData.links || undefined
      })
      
      // 更新本地状态
      const userTask = myTasks.value.find(ut => ut.taskId === taskId)
      if (userTask) {
        userTask.status = 'completed'
        userTask.completedAt = new Date().toISOString()
        userTask.submissionData = submissionData
      }
      
      return response
    } catch (error) {
      console.error('提交任务失败:', error)
      throw error
    }
  }

  const fetchMyTasks = async () => {
    loading.value = true
    try {
      // TODO: 调用API获取我的任务
      // 这里返回已有的myTasks数据
    } catch (error) {
      console.error('获取我的任务失败:', error)
    } finally {
      loading.value = false
    }
  }

  const getTaskStatus = (taskId: number) => {
    const userTask = myTasks.value.find(ut => ut.taskId === taskId)
    return userTask?.status || 'available'
  }

  return {
    // 状态
    taskList,
    myTasks,
    currentTask,
    loading,
    // 方法
    fetchTaskList,
    fetchTaskDetail,
    claimTask,
    submitTask,
    fetchMyTasks,
    getTaskStatus
  }
})
