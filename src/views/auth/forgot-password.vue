<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <!-- 头部 -->
      <div class="header">
        <van-nav-bar
          :title="$t('auth.forgotPassword')"
          left-arrow
          @click-left="goBack"
        />
      </div>

      <!-- 表单区域 -->
      <div class="form-section">
        <div class="form-header">
          <h2 class="form-title">{{ $t('auth.resetPasswordTitle' as any) }}</h2>
          <p class="form-desc">{{ $t('auth.resetPasswordDesc' as any) }}</p>
        </div>

        <van-form @submit="handleResetPassword" class="reset-form">
          <!-- 手机号码 -->
          <div class="form-group">
            <label class="form-label">{{ $t('auth.mobileNumber' as any) }}</label>
            <div class="mobile-input-row">
              <div class="area-code-field">
                <van-field
                  v-model="form.area_code"
                  name="area_code"
                  placeholder="+84"
                  type="tel"
                  class="area-code-input"
                />
              </div>
              <div class="mobile-field">
                <van-field
                  v-model="form.mobile"
                  name="mobile"
                  :placeholder="$t('auth.enterMobile')"
                  type="tel"
                  clearable
                  class="mobile-input"
                />
              </div>
            </div>
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label class="form-label">{{ $t('auth.verificationCode') }}</label>
            <van-field
              v-model="form.captcha"
              name="captcha"
              :placeholder="$t('auth.enterCaptcha' as any)"
              clearable
              class="captcha-input"
            >
              <template #button>
                <van-button 
                  size="small" 
                  type="primary" 
                  :disabled="isSendingCode"
                  @click="sendVerificationCode"
                  class="send-code-btn"
                >
                  {{ isSendingCode ? `${countdown}s` : $t('auth.sendCode' as any) }}
                </van-button>
              </template>
            </van-field>
          </div>

          <!-- 新密码 -->
          <div class="form-group">
            <label class="form-label">{{ $t('auth.newPassword' as any) }}</label>
            <van-field
              v-model="form.newpassword"
              name="newpassword"
              :placeholder="$t('auth.enterNewPassword' as any)"
              :type="showPassword ? 'text' : 'password'"
              :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
              @click-right-icon="showPassword = !showPassword"
              clearable
              class="password-input"
            />
            <div class="password-tip">{{ $t('auth.passwordTip' as any) }}</div>
          </div>

          <!-- 确认新密码 -->
          <div class="form-group">
            <label class="form-label">{{ $t('auth.confirmNewPassword' as any) }}</label>
            <van-field
              v-model="form.confirmPassword"
              name="confirmPassword"
              :placeholder="$t('auth.enterConfirmPassword' as any)"
              :type="showConfirmPassword ? 'text' : 'password'"
              :right-icon="showConfirmPassword ? 'eye-o' : 'closed-eye'"
              @click-right-icon="showConfirmPassword = !showConfirmPassword"
              clearable
              class="password-input"
            />
          </div>

          <!-- 提交按钮 -->
          <div class="submit-section">
            <van-button 
              type="primary" 
              size="large" 
              block 
              :loading="loading"
              native-type="submit"
              class="submit-btn"
            >
              {{ $t('auth.resetPassword' as any) }}
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 底部链接 -->
      <div class="footer-links">
        <span class="back-to-login" @click="goToLogin">
          {{ $t('auth.backToLogin' as any) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { $t } from '@/locales'
import { smsSend, resetPassword } from '@/api/sms'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSendingCode = ref(false)
const countdown = ref(0)

// 表单数据
const form = reactive({
  mobile: '',
  area_code: '+84',
  captcha: '',
  newpassword: '',
  confirmPassword: ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到登录页
const goToLogin = () => {
  router.push({ name: 'Auth' })
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.mobile) {
    showToast($t('auth.enterMobile' as any))
    return
  }
  
  if (isSendingCode.value) return
  
  try {
    isSendingCode.value = true
    const res = await smsSend({
      mobile: form.mobile,
      area_code: form.area_code.replace('+', ''),
      event: 'resetpwd'
    })
    
    if (res) {
      showToast($t('auth.codeSent' as any))
      startCountdown()
    } else {
      showToast(res.msg || $t('auth.sendCodeFailed' as any))
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    showToast(error.msg || $t('auth.sendCodeFailed' as any))
  } finally {
    isSendingCode.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  isSendingCode.value = true
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSendingCode.value = false
    }
  }, 1000)
}

// 处理重置密码
const handleResetPassword = async () => {
  // 验证表单
  if (!form.mobile) {
    showToast($t('auth.enterMobile' as any))
    return
  }
  
  if (!form.captcha) {
    showToast($t('auth.enterCaptcha' as any))
    return
  }
  
  if (!form.newpassword) {
    showToast($t('auth.enterNewPassword' as any))
    return
  }
  
  if (form.newpassword.length < 6) {
    showToast($t('auth.passwordMinLength' as any))
    return
  }
  
  if (form.newpassword !== form.confirmPassword) {
    showToast($t('auth.passwordMismatch' as any))
    return
  }
  
  try {
    loading.value = true
    const res = await resetPassword({
      mobile: form.mobile,
      area_code: form.area_code.replace('+', ''),
      captcha: form.captcha,
      newpassword: form.newpassword
    })
    
    if (res) {
      showToast($t('auth.resetPasswordSuccess' as any))
      // 重置成功后跳转到登录页
      setTimeout(() => {
        router.push({ name: 'Auth' })
      }, 1500)
    } else {
      showToast(res.msg || $t('auth.resetPasswordFailed' as any))
    }
  } catch (error) {
    console.error('重置密码失败:', error)
    showToast(error.msg || $t('auth.resetPasswordFailed' as any))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-password-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.form-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.form-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.reset-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.mobile-input-row {
  display: flex;
  gap: 10px;
}

.area-code-field {
  width: 100px;
}

.mobile-field {
  flex: 1;
}

.area-code-input,
.mobile-input,
.captcha-input,
.password-input {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.area-code-input :deep(.van-field__control),
.mobile-input :deep(.van-field__control),
.captcha-input :deep(.van-field__control),
.password-input :deep(.van-field__control) {
  padding: 8px 12px;
  font-size: 14px;
  height: 40px;
}

.send-code-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 0 8px;
  height: 28px;
}

.password-tip {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.submit-section {
  margin-top: 24px;
}

.submit-btn {
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.footer-links {
  text-align: center;
  padding: 20px;
}

.back-to-login {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.back-to-login:hover {
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .form-section {
    padding: 12px;
  }
  
  .reset-form {
    padding: 18px;
  }
  
  .form-title {
    font-size: 22px;
  }
  
  .form-group {
    margin-bottom: 14px;
  }
}
</style>
