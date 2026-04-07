<template>
  <div class="message-page">
    <!-- 消息分类 -->
    <!-- <div class="message-tabs">
      <van-tabs v-model:active="activeTab" @change="handleTabChange">
        <van-tab :title="$t('message.all')" name="all" />
      </van-tabs>
    </div> -->

    <!-- 消息列表 -->
    <div class="message-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('common.noMore')"
          @load="onLoad"
        >
          <div 
            v-for="message in filteredMessages" 
            :key="message.id"
            class="message-item"
            :class="{ 'unread': !message.read }"
            @click="readMessage(message)"
          >
            <div class="message-icon">
              <van-icon name="envelop-o" size="20" />
            </div>
            <div class="message-content">
              <div class="message-title">{{ message.title }}</div>
              <div class="message-text" v-html="message.msg"></div>
              <div class="message-time">{{ message.created_at }}</div>
            </div>
            <div class="message-actions" v-if="!message.read">
              <van-button 
                size="mini" 
                type="primary" 
                plain
                @click.stop="markAsRead(message)"
              >
                {{ $t('message.markAsRead') }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 空状态 -->
    <van-empty 
      v-if="!loading && filteredMessages.length === 0" 
      :description="$t('message.noMessages')"
      image="bell-o"
    />

    <!-- 消息详情弹窗 -->
    <van-popup 
      v-model:show="showMessageDetail" 
      position="center" 
      round
      :style="{ width: '90%', maxWidth: '500px' }"
    >
      <div class="message-detail-popup">
        <div class="popup-header">
          <h3 class="popup-title">{{ currentMessage?.title }}</h3>
          <van-icon 
            name="cross" 
            size="20" 
            @click="showMessageDetail = false"
            class="close-btn"
          />
        </div>
        <div class="popup-content">
          <div class="message-time">{{ currentMessage?.created_at }}</div>
          <div class="message-content" v-html="currentMessage?.msg"></div>
        </div>
        <div class="popup-footer">
          <van-button 
            type="primary" 
            size="small" 
            @click="showMessageDetail = false"
          >
            {{ $t('message.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { $t } from '@/locales'

const activeTab = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)

// 消息详情弹窗
const showMessageDetail = ref(false)
const currentMessage = ref<any>(null)

const messages = ref<any[]>([])

const filteredMessages = computed(() => {
  return messages.value
})



const onLoad = async () => {
  try {
    const { getMsgHistory } = await import('@/api/usermsg')
    const res = await getMsgHistory({ pageIndex: 1 })
    messages.value = (res as any)?.rows || []
  } finally {
    finished.value = true
  }
}

const onRefresh = async () => {
  refreshing.value = true
  await onLoad()
  refreshing.value = false
}

const readMessage = async (message: any) => {
  // 如果是未读消息，先标记为已读
  if (!message.read) {
    try {
      const { getUserMsg } = await import('@/api/usermsg')
      await getUserMsg({ id: message.id })
      message.read = 1
    } catch (error) {
      console.error('标记已读失败:', error)
      showToast($t('message.markReadFailed'))
    }
  }
  // 显示消息详情弹窗
  currentMessage.value = message
  showMessageDetail.value = true
}

const markAsRead = async (message: any) => {
  try {
    const { getUserMsg } = await import('@/api/usermsg')
    await getUserMsg({ id: message.id })
    message.read = 1
    showToast($t('message.markedAsRead'))
  } catch (error) {
    console.error('标记已读失败:', error)
    showToast(error.msg || $t('message.markReadFailed'))
  }
}




onMounted(() => {
  // 初始化消息数据
})
</script>

<style scoped>
.message-page {
  padding-bottom: 60px;
}

.message-tabs {
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.message-list {
  padding: 16px;
}

.message-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-item.unread {
  background: #f6ffed;
  border-left: 4px solid #52c41a;
}

.message-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #1890ff;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  margin-right: 12px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-text {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 消息文本中的HTML标签样式 */
.message-text :deep(b),
.message-text :deep(strong) {
  font-weight: 600;
  /* color: #1890ff; */
}

.message-text :deep(p) {
  margin: 0;
  display: inline;
}

.message-text :deep(br) {
  display: none;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.batch-actions {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

.batch-actions .van-button {
  flex: 1;
}

:deep(.van-tabs__line) {
  background: #1890ff;
}

:deep(.van-tab--active) {
  color: #1890ff;
}

/* 消息详情弹窗样式 */
.message-detail-popup {
  padding: 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.close-btn {
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #666;
}

.popup-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
}

.popup-content .message-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.popup-content .message-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.popup-content .message-content p,
.popup-content .message-content div {
  margin: 0 0 12px 0;
}

.popup-content .message-content p:last-child,
.popup-content .message-content div:last-child {
  margin-bottom: 0;
}

/* HTML内容样式优化 */
.popup-content .message-content b,
.popup-content .message-content strong {
  font-weight: 600;
  color: #1890ff;
}

.popup-content .message-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px 0;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.popup-content .message-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.popup-content .message-content li {
  margin: 4px 0;
  line-height: 1.5;
}

.popup-content .message-content hr {
  margin: 16px 0;
  border: none;
  border-top: 1px solid #e8e8e8;
}

.popup-content .message-content br {
  line-height: 1.8;
}

/* 优化长内容的显示 */
.popup-content .message-content {
  word-wrap: break-word;
  word-break: break-word;
}

.popup-content .message-content * {
  max-width: 100%;
}

/* 滚动条样式 */
.popup-content::-webkit-scrollbar {
  width: 4px;
}

.popup-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
}
</style>
