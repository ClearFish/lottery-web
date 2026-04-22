<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- 登录表单 -->
      <div v-if="mode === 'login'" class="form-container">
        <van-form @submit="handleLogin" class="auth-form">
            

          <div class="form-group">
            <!-- 用户名登录 -->
            <div  class="input-wrapper">
              <van-field
                v-model="loginForm.agent_user"
                name="username"
                placeholder="agent_user"
                left-icon="user-o"
                clearable
                class="custom-field"
              />
            </div>
            <div class="input-wrapper">
              <van-field
                v-model="loginForm.username"
                name="password"
                placeholder="username"
                :type="showLoginPassword ? 'text' : 'password'"
                left-icon="lock"
                :right-icon="showLoginPassword ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showLoginPassword = !showLoginPassword"
                clearable
                class="custom-field"
              />
            </div>
            <div class="input-wrapper">
              <van-field
                v-model="loginForm.user_id"
                name="password"
                placeholder="user_id"
                type="text"
                clearable
                class="custom-field"
              />
            </div>
            <div class="input-wrapper">
              <van-field
                v-model="loginForm.currency"
                name="password"
                placeholder="currency"
                type="text"
                clearable
                class="custom-field"
              />
            </div>
          </div>
          <van-button 
            type="primary" 
            size="large" 
            block 
            :loading="loading"
            native-type="submit"
            class="submit-btn"
          >
            {{ $t('auth.login') }}
          </van-button>
        </van-form>
       
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import {useSiteStore} from "@/store/modules/site"
import { useSystemStore } from '@/store/modules/system'
import { showToast, showDialog } from 'vant'
import { $t } from '@/locales'
const router = useRouter()

const route = useRoute()
const userStore = useUserStore()
const systemStore = useSystemStore()
console.log(systemStore.time)
const mode = ref<'login' | 'register'>('login')
const showLoginPassword = ref(false)
const loading = ref(false)
const currentLocale = import.meta.env.VITE_LOCALE as string | undefined
const localeAreaCodeMap: Record<string, string> = {
  yuenan: '+84',
  'zh-cn': '+86'
}
const defaultAreaCode = localeAreaCodeMap[currentLocale ?? ''] || '+84'
const validateMobileByAreaCode = (mobile: string, areaCode: string) => {
  const normalizedAreaCode = (areaCode || '').replace(/^\+/, '')
  if (normalizedAreaCode === '86') {
    return /^1\d{10}$/.test(mobile)
  }
  return /^\d{9,10}$/.test(mobile)
}

const backHome = ()=>{
  router.push({path: "/"})
}
// 根据路由参数设置模式
onMounted(async() => {
  if (route.query.mode === 'register') {
    mode.value = 'register'
  } else {
    mode.value = 'login'
  }

  

})


// 登录表单
const loginForm = reactive({
  agent_user: 'super_agent',
  username: 'player001',
  user_id: '12345',
  currency: 'USDT',
  sign:"7ff76dae8e73866820739474ab05f0ad9f5e0a497f31c649dc15b83f95c1ff72"
})



// 登录处理
const handleLogin = async () => {
console.log(systemStore.time)
  try {
    await userStore.login(loginForm)
    showToast($t('auth.loginSuccess'))
    router.push({ name: 'Home' })
  } catch (error) {
    showToast(error.msg || $t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}



// 显示用户协议
const showAgreement = () => {
  showDialog({
    title: $t('auth.userAgreement'),
    message: $t('auth.userAgreementContent'),
    showCancelButton: false
  })
}

// 显示隐私政策
const showPrivacy = () => {
  showDialog({
    title: $t('auth.privacyPolicy'),
    message: $t('auth.privacyPolicyContent'),
    showCancelButton: false
  })
}


// 生成邀请链接
const generateInviteLink = (inviteCode: string) => {
  const baseUrl = window.location.origin
  return `${baseUrl}/#/auth?mode=register&invite_code=${inviteCode}`
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push({ name: 'ForgotPassword' })
}


</script>

<style scoped lang="less">
.auth-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 30px;
  padding-top: 50px;
}
.headder {
  height: 50px;
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  justify-content:space-between;
  align-items: center;
  background: #fff;
  z-index: 99;
  .head_logo {
    height: 30px;
    width: auto;
  }
  .right {
    width:16px
  }
}
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.banner_box {
  padding: 10px;
  box-sizing: border-box;
}
.banner-swipe {
  height: 150px;
}

.banner-item {
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.banner-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

/* 模式切换 */
.mode-switch {
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  margin: 20px;
}

/* 登录类型切换按钮 */
.login-type-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.toggle-btn {
  border-radius: 20px;
  font-size: 12px;
  padding: 0 16px;
  height: 32px;
  border: 1px solid #e9ecef;
}

.toggle-btn.van-button--primary {
  background: #667eea;
  border-color: #667eea;
}

.toggle-btn.van-button--default {
  background: white;
  color: #666;
  border-color: #e9ecef;
}

.switch-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.switch-item.active {
  color: #667eea;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


/* 表单容器 */
.form-container {
  padding: 0 20px;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  margin-bottom: 12px;
}

.field-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  margin-left: 8px;
}

.mobile-row {
  display: flex;
  gap: 8px;
}

.area-code-field {
  flex: 0 0 120px;
}

.mobile-field {
  flex: 1;
}

.area-code .van-field__control {
  text-align: center;
}

.custom-field {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.custom-field :deep(.van-field__control) {
  padding: 8px 12px;
  font-size: 14px;
  height: 40px;
}

.custom-field :deep(.van-field__left-icon) {
  color: #667eea;
  margin-right: 8px;
}

.custom-field :deep(.van-field__right-icon) {
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.custom-field :deep(.van-field__right-icon:hover) {
  color: #667eea;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.custom-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.forgot-password {
  font-size: 14px;
  color: #667eea;
  cursor: pointer;
}

.submit-btn {
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  background: #667eea;
  border: none;
}

.agreement {
  margin: 16px 0;
}

.link {
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
}

/* 快速登录 */
.quick-login {
  margin-top: 24px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 16px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider-text {
  background: white;
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.sms-btn {
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #e9ecef;
  background: white;
  color: #666;
}

/* 手机号输入容器 */
.mobile-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.area-code-btn {
  flex-shrink: 0;
  height: 65px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
  color: #666;
  font-size: 14px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.area-code-btn:hover {
  background: #e9ecef;
  color: #667eea;
}

.mobile-field {
  flex: 1;
}

.mobile-field :deep(.van-field__control) {
  padding: 8px 12px;
  font-size: 14px;
  height: 40px;
}

</style>
