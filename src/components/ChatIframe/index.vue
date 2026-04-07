<template>
  <div class="chat-iframe-container" :class="[containerClass, { 'modal-mode': isModal }]">
    <!-- 聊天iframe -->
    <iframe
      :src="chatUrl"
      allow="camera *; microphone *; fullscreen *;"
      frameborder="0"
      width="100%"
      height="100%"
      :id="iframeId"
      :class="iframeClass"
      :style="{ pointerEvents: stopIframe ? 'none' : 'all' }"
      @load="onChatLoaded"
      @error="onChatError"
    />
    
    <!-- 加载状态覆盖层 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
    
    <!-- 关闭按钮（仅在弹窗模式下显示） -->
    <div v-if="showCloseButton" class="close-btn" @click="handleClose">
      <van-icon name="cross" size="20" />
    </div>
    
    <!-- 游戏分享按钮 -->
    <div v-if="showGameShare" class="game-share-btn" @click="openGameShare">
      <van-icon name="share" size="16" />
      <span>{{ $t('chatIframe.shareGame') }}</span>
    </div>
    
    <!-- 游戏分享组件 -->
    <GameShare 
      :show="showGameShareDialog"
      @close="closeGameShare"
      @share-game="handleShareGame"
    />
    
    <!-- 昵称设置弹窗 -->
    <NicknameDialog 
      :show="showNicknameDialog"
      @close="closeNicknameDialog"
      @success="onNicknameSetSuccess"
    />
    <!-- 发起跟投 -->
    <FollowUp
      ref="followRef"
      @closeFollow="canclePrevent"
    />
    <HistoryBet @closeFollow="canclePrevent" ref="historyRef" @toFollow="toFollowBet"/>
    <RecentBet  @closeFollow="canclePrevent" ref="recentRef"/>

    <FollowActivityModal v-model:show="showModal" />
  </div>
</template>

<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'ChatIframe'
})
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameShare from '@/components/GameShare/index.vue'
import NicknameDialog from '@/components/NicknameDialog/index.vue'
import { useUserStore } from '@/store/modules/user'
import FollowUp from "@/components/follow-up/index.vue"
import HistoryBet from "@/components/follow-up/historyBet.vue"
import RecentBet from "@/components/follow-up/recentBet.vue"
import FollowActivityModal from '@/components/FollowActivityModal/index.vue'
// Props
interface Props {
  chatUrl: string
  domain?: string
  containerClass?: string
  iframeClass?: string
  iframeId?: string
  loadingText?: string
  showCloseButton?: boolean
  isModal?: boolean
  showGameShare?: boolean
  shareRoomInfo?: any
}

const props = withDefaults(defineProps<Props>(), {
  domain: '',
  containerClass: '',
  iframeClass: '',
  iframeId: 'chatIFrame',
  loadingText: 'Loading...',
  showCloseButton: false,
  isModal: false,
  showGameShare: false,
  shareRoomInfo: null
})

const showModal = ref(false)

// Emits
const emit = defineEmits<{
  close: []
  loaded: []
  error: []
  unreadCount: [count: number]
  chatUIOpen: [isOpen: boolean]
  launchFollow: [data: any]
  userFollow: [data: any]
  followList: [data: any]
  betList: []
  enterGame: [gameInfo: any, data: any]
  enterSelfGame: [gameInfo: any]
  setRoomInfo: [roomInfo: any]
}>()

// 响应式数据
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()
const showGameShareDialog = ref(false)
const stopIframe = ref(false)
const shareRoomInfo = ref<any>(null)
const showNicknameDialog = ref(false)
const followRef = ref<any>(null)
const historyRef = ref<any>(null)
const recentRef = ref<any>(null)
const lastHandledRouteKey = ref<string>('')
const shouldHandleNextLoad = ref(true)
// 用户store
const userStore = useUserStore()


// iframe加载完成
const onChatLoaded = () => {
  const currentRouteKey = route.fullPath || route.path || ''

  if (!shouldHandleNextLoad.value && currentRouteKey === lastHandledRouteKey.value) {
    console.log('iframe load ignored because route unchanged:', currentRouteKey)
    return
  }

  shouldHandleNextLoad.value = false
  lastHandledRouteKey.value = currentRouteKey

  isLoading.value = false
  emit('loaded')
  
  // 检查是否有传递的domain和isChat参数
  const domain = route.query.domain as string
  const isChat = route.query.isChat as string
  
  console.log('iframe加载完成 - domain:', domain, 'isChat:', isChat)
  
  // 只有在明确需要发送消息时才发送（isChat === 'true'）
  // 这样可以避免在 iframe 内部页面导航时（如返回聊天列表）重复触发
  if (domain && isChat === 'true') {
    console.log('有domain和isChat参数，准备发送postMessage')
    sendDomainMessage(domain)
  } else {
    console.log('没有domain和isChat参数，跳过postMessage')
  }
  
  // 检查用户是否需要设置昵称
  checkNicknameRequired()
}

// iframe加载错误
const onChatError = () => {
  isLoading.value = false
  emit('error')
}
const canclePrevent = ()=>{
  stopIframe.value = false
}
// 发送domain消息的配置常量
const MAX_RETRY_ATTEMPTS = 10
const RETRY_DELAY = 500
const INITIAL_DELAY = 500

// 存储定时器ID，用于清理
const domainMessageTimers = new Set<number>()

// 记录已发送的domain消息，防止重复发送
// 使用 Map 存储，key 为 domain，value 为发送时间戳
const sentDomainMessages = new Map<string, number>()

// 防抖时间：同一 domain 在 3 秒内只发送一次
const DEBOUNCE_TIME = 3000

// 当前正在处理的 domain（防止并发）
let currentProcessingDomain: string | null = null

// 发送domain消息
const sendDomainMessage = (domain: string) => {
  if (!domain) return
  
  // 检查是否在防抖时间内已经发送过相同的 domain
  const lastSentTime = sentDomainMessages.get(domain)
  const now = Date.now()
  
  if (lastSentTime && (now - lastSentTime) < DEBOUNCE_TIME) {
    console.log(`domain消息已在 ${Math.round((now - lastSentTime) / 1000)} 秒前发送过，跳过重复发送:`, domain)
    return
  }
  
  // 如果正在处理相同的 domain，跳过
  if (currentProcessingDomain === domain) {
    console.log('domain消息正在处理中，跳过重复请求:', domain)
    return
  }
  
  // 清理之前的定时器（如果有）
  domainMessageTimers.forEach(timerId => {
    clearTimeout(timerId)
  })
  domainMessageTimers.clear()
  
  // 设置当前正在处理的 domain
  currentProcessingDomain = domain
  
  console.log('准备发送domain消息:', domain)
  
  // 发送消息的通用函数
  const sendMessage = (iframe: HTMLIFrameElement): boolean => {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'username',
          msg: `t:resolve?domain=${domain}`
        },
        '*'
      )
      // 记录发送时间
      sentDomainMessages.set(domain, Date.now())
      console.log('已发送domain消息:', domain)
      // 清除当前处理的 domain
      currentProcessingDomain = null
      return true
    }
    return false
  }
  
  // 使用更高效的检测方法
  const waitForIframeReady = async (attempts = 0): Promise<void> => {
    // 如果 domain 已改变，停止处理
    if (currentProcessingDomain !== domain) {
      console.log('domain已改变，停止处理:', domain)
      return
    }
    
    const iframe = document.getElementById(props.iframeId) as HTMLIFrameElement
    
    if (!iframe || !iframe.contentWindow) {
      // iframe还未准备好，继续等待
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const timerId = window.setTimeout(() => {
          domainMessageTimers.delete(timerId)
          waitForIframeReady(attempts + 1)
        }, RETRY_DELAY)
        domainMessageTimers.add(timerId)
      } else {
        console.warn('iframe未准备好，已达到最大重试次数')
        currentProcessingDomain = null
      }
      return
    }
    
    try {
      // 检查iframe的document是否可访问
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      
      if (iframeDoc && iframeDoc.readyState === 'complete') {
        // iframe完全加载，发送domain消息
        console.log('iframe完全加载，发送domain消息:', domain)
        sendMessage(iframe)
        return // 成功发送，退出函数
      } else {
        // iframe还未完全加载，继续等待
        if (attempts < MAX_RETRY_ATTEMPTS) {
          const timerId = window.setTimeout(() => {
            domainMessageTimers.delete(timerId)
            waitForIframeReady(attempts + 1)
          }, RETRY_DELAY)
          domainMessageTimers.add(timerId)
        } else {
          // 达到最大重试次数，尝试直接发送（可能仍在加载中）
          console.warn('iframe加载超时，尝试直接发送消息')
          sendMessage(iframe)
        }
      }
    } catch (error) {
      // 跨域限制，无法访问document
      // 跨域情况下，直接尝试发送消息（postMessage不受跨域限制）
      console.log('跨域限制，无法访问iframe document，直接发送消息')
      // 加个等待时间
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (sendMessage(iframe)) {
        return // 成功发送，退出函数
      }
      // window.location.reload()
      
      // 如果发送失败，继续重试
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const timerId = window.setTimeout(() => {
          domainMessageTimers.delete(timerId)
          waitForIframeReady(attempts + 1)
        }, RETRY_DELAY)
        domainMessageTimers.add(timerId)
      } else {
        console.error('发送domain消息失败，已达到最大重试次数')
        currentProcessingDomain = null
      }
    }
  }
  
  // 初始延迟后开始检测
  const timerId = window.setTimeout(() => {
    domainMessageTimers.delete(timerId)
    waitForIframeReady()
  }, INITIAL_DELAY)
  domainMessageTimers.add(timerId)
}

// 关闭处理
const handleClose = () => {
  emit('close')
}

// 打开游戏分享
const openGameShare = () => {
  showGameShareDialog.value = true
}

// 关闭游戏分享
const closeGameShare = () => {
  showGameShareDialog.value = false
  stopIframe.value = false
}

// 关闭昵称设置弹窗
const closeNicknameDialog = () => {
  showNicknameDialog.value = false
}

// 昵称设置成功
const onNicknameSetSuccess = () => {
  showNicknameDialog.value = false
  // 刷新用户信息
  userStore.fetchUserInfo()
}

// 检查是否需要设置昵称
const checkNicknameRequired = () => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    return // 未登录用户不需要设置昵称
  }
  
  // 检查用户信息中的昵称是否等于用户名
  if (userStore.userInfo) {
    if (userStore.userInfo.nickname === userStore.userInfo.username) {
      // 昵称等于用户名，需要设置昵称
      showNicknameDialog.value = true
    }
  }
}

// 处理游戏分享
const handleShareGame = (game: any) => {
  const iframe = document.getElementById(props.iframeId) as HTMLIFrameElement
  if (iframe && iframe.contentWindow) {
    const imgURL = window.location.origin
    
    console.log('分享游戏数据:', {
      shareRoomInfo: shareRoomInfo.value,
      game: game,
      groupId: shareRoomInfo.value?.groupId,
      groupType: shareRoomInfo.value?.groupType,
      userId: localStorage.getItem('userId') || sessionStorage.getItem('userId'),
      token: localStorage.getItem('token') || sessionStorage.getItem('token')
    })
    
    iframe.contentWindow.postMessage(
      {
        type: "returnShareGame",
        msg: {
          groupId: shareRoomInfo.value?.groupId,
          groupType: shareRoomInfo.value?.groupType,
          gameId: game.game_list_id,
          gameName: game.title,
          gameLogo: imgURL + game.icon,
          gameInfo: { ...game }
        },
      },
      "*"
    )
    
    console.log('分享游戏:', game)
  }
}

// 监听chatUrl变化，重新加载
watch(() => props.chatUrl, (newUrl, oldUrl) => {
  if (newUrl && newUrl !== oldUrl) {
    console.log('chatUrl变化，重置加载状态:', newUrl)
    isLoading.value = true
    shouldHandleNextLoad.value = true
    // 清理之前的定时器和处理状态
    domainMessageTimers.forEach(timerId => {
      clearTimeout(timerId)
    })
    domainMessageTimers.clear()
    currentProcessingDomain = null
    // 可选：清理已发送记录，允许新的 URL 重新发送消息
    // sentDomainMessages.clear()
  }
})

watch(() => route.fullPath, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    shouldHandleNextLoad.value = true
  }
})

// 消息监听
const receiveMessage = (e: MessageEvent) => {
  const { data, type, count } = e.data
  // 处理未读消息数量
  if (count !== undefined) {
    emit('unreadCount', count)
    
    // 直接更新全局store
    import('@/store/modules/message').then(({ useMessageStore }) => {
      const { setUnreadCount } = useMessageStore()
      setUnreadCount(count)
    })
  }
  
  if(type === 'clickCustomLinkType') {
    // 处理显示跟投弹窗
    if(data.type === "followtask") {
      showModal.value = true
    }
    return
  }

  // 处理聊天UI显隐
  if (type === 'chatUIOpen') {
    console.log('ChatIframe: 收到chatUIOpen消息，数据:', data)
    emit('chatUIOpen', data)
    console.log('ChatIframe: 已发送chatUIOpen事件')
    return
  }
  
  // 处理分享游戏请求
  if (type === 'clickShareGame') {
    console.log('收到分享游戏请求，数据:', data)
    if (isUserLoggedIn()) {
      shareRoomInfo.value = data
      console.log('设置shareRoomInfo:', shareRoomInfo.value)
      showGameShareDialog.value = true
      stopIframe.value = true
    } else {
      emit('close')
      // 跳转到登录页面
      window.location.href = '/#/auth'
    }
  }
  
  // 处理点击分享的游戏进入游戏
  if (type === 'clickIntoShareGame') {
    handleEnterShareGame(data)
  }
  
  // 处理发起跟投
  if (type === 'clickLaunchFollow') {
    if (isUserLoggedIn()) {
      // emit('launchFollow', data)
      followRef.value && followRef.value.showFollow({isLunch:true,...data})
      stopIframe.value = true
    } else {
      emit('close')
      window.location.href = '/#/auth'
    }
  }
  // 投注历史
  if(type == 'clickFollowList') {
        historyRef.value && historyRef.value.showFollowList(data);
        stopIframe.value  = true
      }
  // 处理跟投
  if (type === 'clickUserFollow') {
    if (isUserLoggedIn()) {
      // emit('userFollow', data)
      data.betInfo = Object.prototype.toString.call(data.betInfo) === '[object Object]' ? data.betInfo : JSON.parse(data.betInfo);
      followRef.value && followRef.value.showFollow({isLunch:false,...data});
      stopIframe.value = true
    } else {
      emit('close')
      window.location.href = '/#/auth'
    }
  }
  
  // 处理投注历史
  if (type === 'clickFollowList') {
    emit('followList', data)
    stopIframe.value = true
  }
  
  // 处理最近注单
  if (type === 'clickBetList') {
    // emit('betList')
    recentRef.value && recentRef.value.showFollowList();
    stopIframe.value = true
  }
  
  // 处理获取用户收藏
  if (type === 'clickGetUserFavoriteGames') {
    if (isUserLoggedIn()) {
      handleGetUserFavoriteGames(data)
    }
  }
  
  // 处理token过期
  if (type === 'tokenExpires') {
    handleTokenExpires()
  }
}
// 投注历史跟投
const toFollowBet=(data:any)=> {
  let obj  = {
    betInfo:data
  }
  followRef.value && followRef.value.showFollow({isLunch:false,...obj});
  stopIframe.value = true
}
// 检查用户是否登录
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  return !!token
}

// 处理进入分享的游戏
const handleEnterShareGame = (data: any) => {
  if (data.gameInfo.game_type === 'Lottery') {
    // 跳转自研游戏
    //todo
    emit('enterSelfGame', data.gameInfo)
  } else {
    // 跳转第三方游戏 - 直接跳转到游戏页面
    const newQuery = {
      game_name: data.gameInfo.game_name,
      game_code: data.gameInfo.game_code,
      game_list_id: data.gameInfo.game_list_id,
      title: data.gameInfo.title
    }
    
    router.push({
      name: 'Game',
      query: newQuery
    })
  }
  
  if (data.sessionId) {
    emit('setRoomInfo', {
      sessionId: data.sessionId,
      sessionType: data.groupType,
      chatId: data.chatId
    })
  } else {
    emit('setRoomInfo', { liveRoomInfo: data.liveRoomInfo })
  }
}

// 处理获取用户收藏
const handleGetUserFavoriteGames = async (data: any) => {
  try {
    // 这里需要调用获取用户收藏游戏的API
    // const res = await getUserFavoriteGameList({ username: data.userName })
    // 暂时使用模拟数据
    const favoriteGames = []
    const hotGames = []
    
    const iframe = document.getElementById(props.iframeId) as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      const imgURL = window.location.origin
      
      iframe.contentWindow.postMessage(
        {
          type: 'returnUserFavoriteGames',
          msg: {
            identification: data.userName,
            imUserId: data.imUserId,
            favoriteGameList: favoriteGames,
            hotGameList: hotGames
          },
        },
        '*'
      )
    }
  } catch (error) {
    console.error('获取用户收藏失败:', error)
  }
}

// 处理token过期
const handleTokenExpires = async () => {
  try {
    // 重新获取聊天链接
    const { getIMChatLink } = await import('@/utils/im-cache')
    const newChatUrl = await getIMChatLink()
    
    if (newChatUrl) {
      // 更新iframe的src
      const iframe = document.getElementById(props.iframeId) as HTMLIFrameElement
      if (iframe) {
        iframe.src = newChatUrl
      }
    }
  } catch (error) {
    console.error('重新获取聊天链接失败:', error)
  }
}

// 组件挂载时添加消息监听
onMounted(() => {
  window.addEventListener('message', receiveMessage, true)
  // 注意：onChatLoaded 应该由 iframe 的 @load 事件触发，而不是在这里手动调用
  // 因为 onMounted 时 iframe 可能还没有加载完成
})

// 组件卸载时移除消息监听和清理定时器
onUnmounted(() => {
  window.removeEventListener('message', receiveMessage, true)
  // 清理所有domain消息相关的定时器
  domainMessageTimers.forEach(timerId => {
    clearTimeout(timerId)
  })
  domainMessageTimers.clear()
  // 清除当前处理的 domain
  currentProcessingDomain = null
  shouldHandleNextLoad.value = true
  lastHandledRouteKey.value = ''
  // 可选：清理已发送记录（如果希望组件卸载后重新发送）
  // sentDomainMessages.clear()
})
</script>

<style scoped>
.chat-iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.chat-iframe-container.modal-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
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
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.game-share-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  font-size: 12px;
}

.game-share-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}
</style>
