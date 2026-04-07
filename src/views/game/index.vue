<template>
  <div class="game-page">
    <!-- 游戏头部 -->
    <div v-if="showGameHeader" class="game-header">
      <div class="header-left">
        <van-icon name="arrow-left" color="#fff" size="18" @click="goBack" />
        <span class="game-title">{{ gameTitle }}</span>
      </div>
      <div class="header-right">
        <van-button 
          type="primary" 
          size="small" 
          @click="goToDeposit"
          class="deposit-btn"
        >
          {{ $t('profile.deposit') }}
        </van-button>
        <!-- 移除原来的聊天按钮 -->
        <van-icon 
          name="expand" 
          size="18" 
          @click="toggleFullscreen"
          class="fullscreen-btn"
        />
      </div>
    </div>

    <!-- 全屏按钮 -->
    <div v-if="isFullscreen && !showGameHeader" class="exit-fullscreen" @click="toggleFullscreen">
      <van-icon name="shrink" size="16" />
    </div>

    <!-- 游戏iframe容器 -->
    <div class="game-container" :class="{ 'fullscreen': isFullscreen }" @click="toggleGameHeader">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <van-loading size="24" />
        <p class="loading-text">{{ $t('game.gameLoading') }}</p>
      </div>

      <!-- 游戏iframe -->
      <iframe
        v-if="gameUrl"
        :src="gameUrl"
        frameborder="0"
        width="100%"
        height="100%"
        @load="onGameLoaded"
        @error="onGameError"
        :style="{ opacity: isLoading ? 0 : 1 }"
        class="game-iframe"
      />
    </div>

    <!-- 浮动按钮 -->
    <div class="floating-chat-button">
      <!-- 游戏大厅图标 -->
      <div 
        class="game-hall-icon-area"
        @click="openGameHall"
      >
        <van-icon 
          name="apps-o" 
          size="16" 
          class="game-hall-icon"
        />
      </div>
      
      <!-- 聊天图标 -->
      <div 
        class="chat-icon-area"
        @click="openChat"
      >
        <van-icon 
          name="chat-o" 
          size="16" 
          class="chat-icon"
        />
        <div v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</div>
      </div>
    </div>

    <!-- 可拖动聊天对话框 -->
    <DraggableChat 
      :show="showChatDialog"
      :chat-url="chatUrl"
      :domain="chatDomain"
      @close="closeChat"
    />

    <!-- 游戏大厅弹窗 -->
    <van-popup
      v-model:show="showGameHallModal"
      position="bottom"
      :style="{ height: '90vh' }"
      round
      closeable
      close-icon-position="top-right"
      :close-on-click-overlay="false"
      @close="closeGameHall"
      class="game-hall-popup"
    >
      <div class="game-hall-container">
        <GameHall @play-game="handlePlayGame" />
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { gameApiLogin } from '@/api/game'
import DraggableChat from '@/components/DraggableChat/index.vue'
import GameHall from '@/views/game-hall/index.vue'
import { getIMChatLink } from '@/utils/im-cache'
import { useMessageStore } from '@/store/modules/message'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()

// 消息store
const { unreadCount } = useMessageStore()

// 自定义返回处理器


// 游戏数据
const gameUrl = ref('')
const gameTitle = ref('')
const isLoading = ref(true)
const isFullscreen = ref(false)
const showGameHeader = ref(true)

// 聊天相关
const showChatDialog = ref(false)
const chatUrl = ref('')
const chatDomain = ref('')

// 游戏大厅弹窗相关
const showGameHallModal = ref(false)


// 进入游戏
const enterGame = async () => {
  try {
    isLoading.value = true
    
    // 从路由参数获取游戏信息
    const { game_name, game_code, game_list_id, title } = route.query
    
    if (!game_name || !game_code || !game_list_id) {
      showToast($t('game.incompleteParams'))
      router.back()
      return
    }

    gameTitle.value = title as string || $t('game.game')
    
    // 调用游戏登录接口
    const res = await gameApiLogin({
      game_name: game_name as string,
      game_code: game_code as string,
      game_list_id: Number(game_list_id)
    })
    
    if (res && res.link) {
      gameUrl.value = res.link
    } else {
      showToast($t('game.getGameLinkFailed'))
      router.back()
    }
  } catch (error: any) {
    console.error('进入游戏失败:', error)
    
    // 检查是否是401未授权错误
    if (error?.response?.status === 401) {
      showToast($t('game.pleaseLoginFirst'))
      // 清除token并跳转到登录页
      localStorage.removeItem('token')
      router.push({ name: 'Auth' })
      return
    }
    
    showToast(error.msg || $t('game.enterGameFailed'))
    router.back()
  }
}

// 游戏加载完成
const onGameLoaded = () => {
  isLoading.value = false
}

// 游戏加载错误
const onGameError = () => {
  isLoading.value = false
  showToast($t('game.gameLoadFailed'))
}

// 返回
const goBack = () => {
  router.push('/')
}

// 自定义返回处理
const handleCustomBack = () => {
  // 如果游戏大厅弹窗打开，先关闭弹窗
  if (showGameHallModal.value) {
    closeGameHall()
    return
  }
  
  // 如果聊天对话框打开，先关闭聊天
  if (showChatDialog.value) {
    closeChat()
    return
  }
  
  // 否则正常返回
  router.push('/')
}

// 充值
const goToDeposit = () => {
  router.push({ name: 'Deposit' })
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // 全屏时隐藏头部，退出全屏时显示头部
  showGameHeader.value = !isFullscreen.value
}

// 切换游戏头部显示
const toggleGameHeader = () => {
  if (isFullscreen.value) {
    showGameHeader.value = !showGameHeader.value
  }
}

// 打开聊天
const openChat = async () => {
  try {
    // 检查是否从聊天会话进入游戏（通过URL参数判断）
    const fromChat = route.query.fromChat === 'true'
    const chatDomain = route.query.chatDomain as string
    
    if (fromChat && chatDomain) {
      // 从聊天会话进入，需要回到之前的会话
      console.log('从聊天会话进入游戏，回到会话:', chatDomain)
      await openChatWithDomain(chatDomain)
    } else {
      // 从游戏界面进入，打开聊天列表
      console.log('从游戏界面进入，打开聊天列表')
      await openChatList()
    }
  } catch (error) {
    console.error('打开聊天失败:', error)
    showToast(error.msg || $t('game.openChatFailed'))
  }
}

// 打开带域名的聊天会话
const openChatWithDomain = async (domain: string) => {
  try {
    const link = await getIMChatLink()
    if (link) {
      chatUrl.value = link
      chatDomain.value = domain
      showChatDialog.value = true
    } else {
      showToast($t('game.getChatLinkFailed'))
    }
  } catch (error) {
    console.error('打开聊天会话失败:', error)
    showToast(error.msg || $t('game.openChatSessionFailed'))
  }
}

// 打开聊天列表
const openChatList = async () => {
  try {
    const link = await getIMChatLink()
    if (link) {
      chatUrl.value = link
      chatDomain.value = '' // 空域名表示进入聊天列表
      showChatDialog.value = true
    } else {
      showToast($t('game.getChatLinkFailed'))
    }
  } catch (error) {
    console.error('打开聊天列表失败:', error)
    showToast(error.msg || $t('game.openChatListFailed'))
  }
}

// 关闭聊天
const closeChat = () => {
  showChatDialog.value = false
  chatUrl.value = ''
  chatDomain.value = ''
}

// 打开游戏大厅
const openGameHall = () => {
  showGameHallModal.value = true
}

// 关闭游戏大厅
const closeGameHall = () => {
  showGameHallModal.value = false
}

// 处理从游戏大厅选择游戏
const handlePlayGame = (game: any) => {
  // 关闭游戏大厅弹窗
  closeGameHall()
  
  // 更新路由参数并重新加载游戏
  const newQuery = {
    game_name: game.game_name,
    game_code: game.game_code,
    game_list_id: game.game_list_id,
    title: game.title
  }
  
  // 使用 push 而不是 replace，保持历史记录
  router.push({
    name: 'Game',
    query: newQuery
  })
  
  // 重新进入游戏
  enterGame()
}


// 监听路由参数变化
watch(() => route.query, (newQuery, oldQuery) => {
  // 如果游戏参数发生变化，重新加载游戏
  if (newQuery.game_name !== oldQuery?.game_name || 
      newQuery.game_code !== oldQuery?.game_code || 
      newQuery.game_list_id !== oldQuery?.game_list_id) {
    enterGame()
  }
}, { deep: true })

// 页面初始化
onMounted(() => {
  
  enterGame()
})
</script>

<style scoped>
.game-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #6b5b95;
  transition: all 0.3s ease;
  z-index: 100;
}

.game-header.hide-header {
  transform: translateY(-100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.deposit-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  height: 28px;
  line-height: 1;
}

.chat-btn {
  color: #fff;
  cursor: pointer;
  margin: 0 8px;
  padding: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s ease;
}

.chat-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}


.fullscreen-btn {
  color: #fff;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s ease;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 浮动按钮样式 */
.floating-chat-button {
  position: fixed;
  width: 24px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 0 0 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  user-select: none;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 70%;
  transform: translateY(-50%);
}

.floating-chat-button:hover {
  width: 28px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.floating-chat-button:active {
  transform: translateY(-50%) scale(0.98);
}

/* 游戏大厅图标区域 */
.game-hall-icon-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.game-hall-icon-area:hover {
  background: rgba(255, 255, 255, 0.1);
}

.game-hall-icon {
  color: white;
  transition: all 0.3s ease;
}

/* 聊天图标区域 */
.chat-icon-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-icon-area:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-icon {
  color: white;
  transition: all 0.3s ease;
}

.unread-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4757;
  color: white;
  font-size: 8px;
  font-weight: 600;
  min-width: 12px;
  height: 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0 2px;
  box-shadow: 0 1px 3px rgba(255, 71, 87, 0.3);
}

.exit-fullscreen {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
}

.exit-fullscreen:hover {
  height: 28px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.exit-fullscreen:active {
  transform: translateX(-50%) scale(0.98);
}

.game-container {
  flex: 1;
  position: relative;
  background: #000;
}

.game-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.loading-text {
  font-size: 14px;
  color: #ccc;
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
  transition: opacity 0.3s ease;
}

/* 游戏大厅弹窗样式 */
.game-hall-popup {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.game-hall-popup.van-popup--show {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.game-hall-container {
  height: 100%;
  overflow: hidden;
}
</style>
