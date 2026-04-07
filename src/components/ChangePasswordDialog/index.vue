<template>
  <van-popup 
    :show="show" 
    position="center" 
    round
    :style="{ width: '320px' }"
    @close="closeDialog"
  >
    <div class="change-password-dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ $t('changePassword.title') }}</h3>
        <p class="dialog-subtitle">{{ $t('changePassword.desc') }}</p>
      </div>
      
      <div class="dialog-content">
        <van-field
          v-model="form.oldPassword"
          :placeholder="$t('changePassword.oldPassword')"
          type="password"
          maxlength="20"
          clearable
          class="password-input"
        />
        <van-field
          v-model="form.newPassword"
          :placeholder="$t('changePassword.newPassword')"
          type="password"
          maxlength="20"
          clearable
          class="password-input"
        />
        <van-field
          v-model="confirmPassword"
          :placeholder="$t('changePassword.confirmPassword')"
          type="password"
          maxlength="20"
          clearable
          class="password-input"
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
          @click="submitPassword"
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
import { changePassword } from '@/api/auth'
import { $t } from '@/locales'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const form = ref({
  oldPassword: '',
  newPassword: ''
})
const confirmPassword = ref('')
const loading = ref(false)

const closeDialog = () => {
  form.value = {
    oldPassword: '',
    newPassword: ''
  }
  confirmPassword.value = ''
  emit('close')
}

const submitPassword = async () => {
  if (!form.value.oldPassword.trim()) {
    showToast($t('changePassword.oldPasswordRequired'))
    return
  }
  
  if (!form.value.newPassword.trim()) {
    showToast($t('changePassword.newPasswordRequired'))
    return
  }
  
  if (form.value.newPassword.length < 6) {
    showToast($t('changePassword.passwordMinLength'))
    return
  }
  
  if (form.value.newPassword !== confirmPassword.value) {
    showToast($t('changePassword.passwordMismatch'))
    return
  }
  
  try {
    loading.value = true
    await changePassword(form.value)
    showToast($t('changePassword.success'))
    emit('success')
    closeDialog()
  } catch (error) {
    console.error('修改密码失败:', error)
    showToast(error.msg || $t('changePassword.failed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-dialog {
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

.password-input {
  margin-bottom: 12px;
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
