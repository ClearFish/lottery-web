<template>
  <div 
    v-if="show" 
    class="draggable-chat-container"
    :class="{ 'fullscreen': isFullscreen }"
  >
    <!-- 全屏模式 -->
    <div v-if="isFullscreen" class="fullscreen-chat">
      <div class="chat-header">
        <div class="chat-title">{{$t('chat.title')}}</div>
        <div class="chat-controls">
          <van-icon 
            name="shrink" 
            size="16" 
            @click="toggleFullscreen"
            class="control-btn"
          />
          <van-icon 
            name="cross" 
            size="16" 
            @click="closeChat"
            class="control-btn"
          />
        </div>
      </div>
      <div class="chat-content">
        <ChatIframe
          :chat-url="chatUrl"
          :domain="domain"
          :container-class="'chat-iframe-container'"
          :iframe-class="'chat-iframe'"
          :iframe-id="'draggable-chat-iframe'"
          :loading-text="$t('common.Loading')"
          :show-close-button="false"
          :is-modal="false"
          @close="closeChat"
        />
      </div>
    </div>

    <!-- 浮动模式 -->
    <div v-else class="floating-chat" :style="chatStyle">
      <div class="chat-header" @mousedown="startDrag" @touchstart="startDrag">
        <div class="chat-title">{{$t('chat.title')}}</div>
        <div class="chat-controls">
          <van-icon 
            name="expand" 
            size="14" 
            @click="toggleFullscreen"
            class="control-btn"
          />
          <van-icon 
            name="cross" 
            size="14" 
            @click="closeChat"
            class="control-btn"
          />
        </div>
      </div>
      <div class="chat-content">
        <ChatIframe
          :chat-url="chatUrl"
          :domain="domain"
          :container-class="'chat-iframe-container'"
          :iframe-class="'chat-iframe'"
          :iframe-id="'draggable-chat-iframe'"
          :loading-text="$t('common.Loading')"
          :show-close-button="false"
          :is-modal="false"
          @close="closeChat"
        />
      </div>
      <!-- 调整大小手柄 -->
      <div class="resize-handle" @mousedown="startResize" @touchstart="startResize"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ChatIframe from '@/components/ChatIframe/index.vue'
import { $t } from '@/locales'
interface Props {
  show: boolean
  chatUrl: string
  domain: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// 状态管理
const isFullscreen = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)

// 位置和大小
const position = ref({ x: 20, y: 100 })
const size = ref({ width: 320, height: 500 })
const minSize = { width: 280, height: 400 }
const maxSize = { width: 600, height: 800 }

// 拖拽相关
const dragStart = ref({ x: 0, y: 0 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// 计算样式
const chatStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  width: `${size.value.width}px`,
  height: `${size.value.height}px`
}))

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 关闭聊天
const closeChat = () => {
  emit('close')
}

// 开始拖拽
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (e.target instanceof HTMLElement && e.target.closest('.control-btn')) {
    return
  }
  
  isDragging.value = true
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  dragStart.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }
  
  e.preventDefault()
}

// 开始调整大小
const startResize = (e: MouseEvent | TouchEvent) => {
  isResizing.value = true
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  resizeStart.value = {
    x: clientX,
    y: clientY,
    width: size.value.width,
    height: size.value.height
  }
  
  e.preventDefault()
  e.stopPropagation()
}

// 处理鼠标/触摸移动
const handleMouseMove = (e: MouseEvent | TouchEvent) => {
  if (isDragging.value) {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const newX = clientX - dragStart.value.x
    const newY = clientY - dragStart.value.y
    
    // 边界检查
    const maxX = window.innerWidth - size.value.width
    const maxY = window.innerHeight - size.value.height
    
    position.value = {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }
  }
  
  if (isResizing.value) {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - resizeStart.value.x
    const deltaY = clientY - resizeStart.value.y
    
    const newWidth = Math.max(minSize.width, Math.min(maxSize.width, resizeStart.value.width + deltaX))
    const newHeight = Math.max(minSize.height, Math.min(maxSize.height, resizeStart.value.height + deltaY))
    
    size.value = {
      width: newWidth,
      height: newHeight
    }
  }
}

// 处理鼠标释放
const handleMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
}

// 初始化位置（居中）
const initPosition = () => {
  position.value = {
    x: (window.innerWidth - size.value.width) / 2,
    y: (window.innerHeight - size.value.height) / 2
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleMouseMove, { passive: false })
  document.addEventListener('touchend', handleMouseUp)
  initPosition()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
})
</script>

<style scoped>
.draggable-chat-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.floating-chat {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  pointer-events: auto;
  user-select: none;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.fullscreen-chat {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  cursor: move;
  user-select: none;
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.chat-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #64748b;
}

.control-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.chat-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-iframe-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  flex: 1;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nw-resize;
  background: linear-gradient(-45deg, transparent 30%, #cbd5e1 30%, #cbd5e1 40%, transparent 40%, transparent 60%, #cbd5e1 60%, #cbd5e1 70%, transparent 70%);
}

.resize-handle:hover {
  background: linear-gradient(-45deg, transparent 30%, #94a3b8 30%, #94a3b8 40%, transparent 40%, transparent 60%, #94a3b8 60%, #94a3b8 70%, transparent 70%);
}

/* 全屏模式样式 */
.fullscreen .chat-header {
  background: #1e293b;
  color: white;
}

.fullscreen .chat-title {
  color: white;
}

.fullscreen .control-btn {
  color: #cbd5e1;
}

.fullscreen .control-btn:hover {
  background: #475569;
  color: white;
}
</style>
