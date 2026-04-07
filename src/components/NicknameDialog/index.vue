<template>
  <van-popup 
    :show="show" 
    position="center" 
    round
    :style="{ width: '320px' }"
    @close="closeDialog"
  >
    <div class="nickname-dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ $t('nicknameDialog.setNickname') }}</h3>
        <p class="dialog-subtitle">{{ $t('nicknameDialog.nicknameDesc') }}</p>
      </div>
      
      <div class="dialog-content">
        <van-field
          v-model="nickname"
          :placeholder="$t('nicknameDialog.nicknamePlaceholder')"
          maxlength="20"
          show-word-limit
          clearable
          class="nickname-input"
        />
      </div>
      
      <div class="dialog-footer">
        <van-button 
          size="large" 
          class="cancel-btn"
          @click="closeDialog"
        >
          {{ $t('common.cancel') }}
        </van-button>
        <van-button 
          type="primary" 
          size="large" 
          class="confirm-btn"
          :loading="loading"
          @click="submitNickname"
        >
          {{ $t('common.confirm') }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { updateNickname } from '@/api/auth'
import { $t } from '@/locales'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const nickname = ref('')
const loading = ref(false)

const closeDialog = () => {
  nickname.value = ''
  emit('close')
}

const submitNickname = async () => {
  if (!nickname.value.trim()) {
    showToast($t('nicknameDialog.nicknameRequired'))
    return
  }
  
  try {
    loading.value = true
    await updateNickname({ nickname: nickname.value.trim() })
    showToast($t('nicknameDialog.nicknameSetSuccess'))
    emit('success')
    closeDialog()
  } catch (error) {
    console.error('设置昵称失败:', error)
    showToast(error.msg || $t('nicknameDialog.setFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.nickname-dialog {
  padding: 20px;
  background: #fff;
}

.dialog-header {
  text-align: center;
  margin-bottom: 20px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.dialog-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.dialog-content {
  margin-bottom: 24px;
}

.nickname-input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.dialog-footer {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  background: #f1f5f9;
  color: #64748b;
  border: none;
}

.confirm-btn {
  flex: 1;
}
</style>
