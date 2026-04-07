import { ref } from 'vue'

// 全局未读消息数量
const unreadCount = ref(0)

// 设置未读消息数量
const setUnreadCount = (count: number) => {
  unreadCount.value = count
}

// 获取未读消息数量
const getUnreadCount = () => {
  return unreadCount.value
}

// 清除未读消息数量
const clearUnreadCount = () => {
  unreadCount.value = 0
}

export const useMessageStore = () => {
  return {
    unreadCount,
    setUnreadCount,
    getUnreadCount,
    clearUnreadCount
  }
}
