<template>
  <div class="chat-page">
    
    <!-- 聊天对话框 -->
    <div class="chat-dialog" :class="{ 'all-height': inChat }" v-if="showChatDialog">
      <ChatIframe
        :chat-url="currentChatUrl"
        :domain="currentDomain"
        @loaded="onChatLoaded"
        @error="onChatError"
        @chatUIOpen="onChatUIOpen"
      />
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <van-loading type="spinner" />
      <p class="loading-text">{{ $t('chat.connecting') }}</p>
    </div>
  </div>
</template>
  
<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Chat'
})
import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getServiceStatus } from '@/api/service'
import { getIMChatLink, clearIMCache } from '@/utils/im-cache'
import ChatIframe from '@/components/ChatIframe/index.vue'
import { $t } from '@/locales'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const showChatDialog = ref(false)
const currentChatUrl = ref('')
const currentDomain = ref('')

// 缓存状态
const isInitialized = ref(false)
const cachedChatUrl = ref('')
const cachedDomain = ref('')

// IM对话状态
const inChat = ref(false)
const userStore = useUserStore()

// 获取IM聊天链接（使用工具函数）
const getIMChatLinkLocal = async () => {
  return await getIMChatLink()
}

// 初始化聊天
const initChat = async () => {
  try {
    // 如果已经初始化过，直接使用缓存的数据
    if (isInitialized.value && cachedChatUrl.value) {
      console.log('Using cached chat data')
      currentChatUrl.value = cachedChatUrl.value
      currentDomain.value = cachedDomain.value
      showChatDialog.value = true
      return
    }
    
    loading.value = true
    
    // 检查是否有从FloatingService传递的参数
    const domain = route.query.domain as string
    const isChat = route.query.isChat as string
    
    // 获取IM聊天链接
    console.log('开始获取IM聊天链接...')
    const chatUrl = await getIMChatLinkLocal()
    console.log('获取到的聊天链接:', chatUrl)
    
    if (!chatUrl) {
      throw new Error('Failed to get chat link')
    }
    
    // 设置聊天参数
    currentChatUrl.value = chatUrl
    currentDomain.value = domain || 'OnlineServices' // 使用传递的domain或默认值
    showChatDialog.value = true
    
    // 缓存数据
    cachedChatUrl.value = chatUrl
    cachedDomain.value = domain || 'OnlineServices'
    isInitialized.value = true
    
    console.log('聊天对话框已显示，URL:', currentChatUrl.value)
  } catch (error) {
    console.error('连接对话失败:', error)
    showToast(error.msg|| 'Chat connection failed')
  } finally {
    loading.value = false
  }
}
  
// iframe加载完成
const onChatLoaded = async () => {
  console.log('聊天页面: iframe加载完成')
  const userId = userStore.userInfo?.id
  const storageKey = userId ? `notificationInit_${userId}` : 'notificationInit_guest'
  if (sessionStorage.getItem(storageKey)) {
    return
  }
  const { initNotificationAfterLogin } = await import('@/utils/pwa')
  await initNotificationAfterLogin()
  sessionStorage.setItem(storageKey, 'true')
}

// iframe加载错误
const onChatError = () => {
  console.log('聊天页面: iframe加载错误')
  showToast($t('chat.loadFailed'))
}

// 处理IM对话UI显隐
const onChatUIOpen = (data: any) => {
  console.log('聊天页面: 收到chatUIOpen事件', data)
  console.log('当前inChat状态:', inChat.value)
  
  if (data === true) {
    inChat.value = false  // 关闭对话，显示导航栏
    console.log('设置inChat为false，显示导航栏')
  } else {
    inChat.value = true   // 打开对话，全屏显示
    console.log('设置inChat为true，全屏显示')
  }
  
  console.log('更新后inChat状态:', inChat.value)
}

// 关闭聊天
const closeChat = () => {
  showChatDialog.value = false
  currentChatUrl.value = ''
  currentDomain.value = ''
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  initChat()
})

// 页面激活时恢复聊天状态（keep-alive缓存）
onActivated(() => {
  console.log('聊天页面激活，恢复聊天状态')
  if (isInitialized.value && cachedChatUrl.value) {
    currentChatUrl.value = cachedChatUrl.value
    currentDomain.value = cachedDomain.value
    showChatDialog.value = true
  } else {
    // 如果缓存不存在，重新初始化
    initChat()
  }
})

// 页面失活时保持聊天状态
onDeactivated(() => {
  console.log('聊天页面失活，保持聊天状态')
  // 保持聊天对话框状态，不清除数据
})
  </script>
  
<style scoped lang="less">
.chat-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
 
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 12px 0 0 0;
}

.chat-dialog {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: calc(100vh - 50px);
  /* 支持iOS安全区域的高度计算 */
//   height: calc(100vh - 60px - env(safe-area-inset-bottom) - env(safe-area-inset-top));
  background: #ffffff;
  display: flex;
  flex-direction: column;
  /* 确保底部不被安全区域遮挡 */
  padding-bottom: env(safe-area-inset-bottom);
}

.chat-dialog.all-height {
    height: auto !important;
  /* iOS安全区域适配 - 使用更精确的计算 */
  z-index: 9999;
  position: fixed;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  bottom: 0;
  /* 确保内容不被安全区域遮挡 */
  padding-top: 0;
  padding-bottom: 0;
}
  
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f1c78b;
    border-top: 4px solid #000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 4px 12px rgba(88, 184, 253, 0.3);
  }
  
  .loading-text {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
  
.chat-frame {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

.iframe-box {
  width: 100%;
  height: 100%;
  border: none;
}
  
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 1001;
  transition: background-color 0.3s ease;
  opacity: 0.7;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
}

  </style>
  