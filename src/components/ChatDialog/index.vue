<template>
  <div class="chat-dialog" v-if="show">
    <ChatIframe
      :chat-url="chatUrl"
      :domain="domain"
      :show-close-button="true"
      :is-modal="true"
      @close="close"
      @loaded="onChatLoaded"
      @error="onChatError"
    />
  </div>
</template>

<script setup lang="ts">
import ChatIframe from '@/components/ChatIframe/index.vue'

// Props
interface Props {
  show: boolean
  chatUrl?: string
  domain?: string
}

const props = withDefaults(defineProps<Props>(), {
  chatUrl: '',
  domain: ''
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// iframe加载完成
const onChatLoaded = () => {
  console.log('ChatDialog: iframe加载完成')
}

// iframe加载错误
const onChatError = () => {
  console.log('ChatDialog: iframe加载错误')
}

// 关闭对话框
const close = () => {
  emit('close')
}
</script>

<style scoped>
.chat-dialog {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}
</style>