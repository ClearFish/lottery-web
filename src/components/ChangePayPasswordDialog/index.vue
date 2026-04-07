<template>
  <van-popup 
    :show="show" 
    position="center" 
    round
    :style="{ width: '320px' }"
    @close="closeDialog"
  >
    <div class="change-pay-password-dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ $t('changePayPassword.title') }}</h3>
        <p class="dialog-subtitle">{{ $t('changePayPassword.desc') }}</p>
      </div>
      
      <div class="dialog-content">
        <van-field
          v-model="form.old_password"
          :placeholder="$t('changePayPassword.oldPassword')"
          type="password"
          maxlength="20"
          clearable
          class="password-input"
        />
        <van-field
          v-model="form.password"
          :placeholder="$t('changePayPassword.newPassword')"
          type="password"
          maxlength="20"
          clearable
          class="password-input"
        />
        <van-field
          v-model="confirmPassword"
          :placeholder="$t('changePayPassword.confirmPassword')"
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
import { reWithdrawalPassword } from '@/api/auth'
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
  old_password: '',
  password: ''
})
const confirmPassword = ref('')
const loading = ref(false)

const closeDialog = () => {
  form.value = {
    old_password: '',
    password: ''
  }
  confirmPassword.value = ''
  emit('close')
}

const submitPassword = async () => {
  if (!form.value.old_password.trim()) {
    showToast($t('changePayPassword.oldPasswordRequired'))
    return
  }
  
  if (!form.value.password.trim()) {
    showToast($t('changePayPassword.newPasswordRequired'))
    return
  }
  
  if (form.value.password.length < 6) {
    showToast($t('changePayPassword.passwordMinLength'))
    return
  }
  
  if (form.value.password !== confirmPassword.value) {
    showToast($t('changePayPassword.passwordMismatch'))
    return
  }
  
  try {
    loading.value = true
    await reWithdrawalPassword(form.value)
    showToast($t('changePayPassword.success'))
    emit('success')
    closeDialog()
  } catch (error) {
    console.error('修改交易密码失败:', error)
    showToast(error.msg || $t('changePayPassword.failed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-pay-password-dialog {
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
