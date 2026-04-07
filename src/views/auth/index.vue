<template>
  <div class="auth-page">
    <div class="headder">
      <div class="left">
        <van-icon name="arrow-left" size="16" color="#666" @click="backHome"/>
      </div>
      <img :src="headerLogo" alt="" class="head_logo" @click="backHome">
      <div class="right"></div>
    </div>
    <div class="auth-container">
      <!-- Banner区域 -->
      <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
         <van-swipe-item v-for="banner in banners" :key="banner.id">
           <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
             <div class="banner-content">
               <h2 class="banner-title">{{ banner.title }}</h2>
               <p class="banner-subtitle">{{ banner.subtitle }}</p>
             </div>
           </div>
         </van-swipe-item>
       </van-swipe>

      <!-- 模式切换 -->
      <div class="mode-switch">
        <div 
          class="switch-item"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          <span>{{ $t('auth.login') }}</span>
        </div>
        <div 
          class="switch-item"
          :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >
          <span>{{ $t('auth.register') }}</span>
        </div>
        <div class="switch-indicator" :style="{ left: mode === 'login' ? '0' : '50%' }"></div>
      </div>

      <!-- 登录表单 -->
      <div v-if="mode === 'login'" class="form-container">
        <van-form @submit="handleLogin" class="auth-form">
          <!-- 登录方式切换按钮 -->
          <div class="login-type-toggle">
            <van-button 
              :type="loginType === 'username' ? 'primary' : 'default'"
              size="small"
              @click="switchLoginType('username')"
              class="toggle-btn"
            >
              {{ $t('auth.usernameLogin') }}
            </van-button>
            <van-button 
              :type="loginType === 'mobile' ? 'primary' : 'default'"
              size="small"
              @click="switchLoginType('mobile')"
              class="toggle-btn"
            >
              {{ $t('auth.mobileLogin') }}
            </van-button>
          </div>

          <div class="form-group">
            <!-- 用户名登录 -->
            <div v-if="loginType === 'username'" class="input-wrapper">
              <van-field
                v-model="loginForm.username"
                name="username"
                :placeholder="$t('auth.enterUsername')"
                left-icon="user-o"
                clearable
                class="custom-field"
              />
            </div>
            
            <!-- 手机号登录 -->
            <div v-if="loginType === 'mobile'" class="input-wrapper mobile-row">
              <div class="area-code-field">
                <van-field
                  v-model="loginForm.area_code"
                  name="area_code"
                  :placeholder="defaultAreaCode"
                  left-icon="phone-o"
                  type="tel"
                  class="custom-field area-code"
                />
              </div>
              <div class="mobile-field">
                <van-field
                  v-model="loginForm.mobile"
                  name="mobile"
                  :placeholder="$t('auth.enterMobile')"
                  type="tel"
                  clearable
                  class="custom-field"
                />
              </div>
            </div>
            
            <div class="input-wrapper">
              <van-field
                v-model="loginForm.password"
                name="password"
                :placeholder="$t('auth.enterPassword')"
                :type="showLoginPassword ? 'text' : 'password'"
                left-icon="lock"
                :right-icon="showLoginPassword ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showLoginPassword = !showLoginPassword"
                clearable
                class="custom-field"
              />
            </div>
          </div>

          <div class="form-options">
            <van-checkbox v-model="rememberMe" class="custom-checkbox">
              <span class="checkbox-text">{{ $t('auth.rememberPassword') }}</span>
            </van-checkbox>
            <span class="forgot-password" @click="goToForgotPassword">{{ $t('auth.forgotPassword') }}</span>
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

      <!-- 注册表单 -->
      <div v-if="mode === 'register'" class="form-container">
        <van-form @submit="handleRegister" class="auth-form">
          <div class="form-group">
            <!-- 用户名 -->
            <div class="input-wrapper">
              <van-field
                v-model="registerForm.username"
                name="username"
                :placeholder="$t('auth.enterUsername')"
                left-icon="user-o"
                clearable
                class="custom-field"
                :rules="usernameRules"
              />
              <div class="field-tip">{{ $t('auth.usernameTip') }}</div>
            </div>
            
            <!-- 区号和手机号码 -->
            <div class="input-wrapper mobile-row">
              <div class="area-code-field">
                <van-field
                  v-model="registerForm.area_code"
                  name="area_code"
                  :placeholder="defaultAreaCode"
                  left-icon="phone-o"
                  type="tel"
                  class="custom-field area-code"
                  :rules="areaCodeRules"
                />
              </div>
              <div class="mobile-field">
                <van-field
                  v-model="registerForm.mobile"
                  name="mobile"
                  :placeholder="$t('auth.enterMobile')"
                  type="tel"
                  clearable
                  class="custom-field"
                  :rules="mobileRules"
                />
              </div>
            </div>
            
            <!-- 密码 -->
            <div class="input-wrapper">
              <van-field
                v-model="registerForm.password"
                name="password"
                :placeholder="$t('auth.enterPassword')"
                :type="showRegisterPassword ? 'text' : 'password'"
                left-icon="lock"
                :right-icon="showRegisterPassword ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showRegisterPassword = !showRegisterPassword"
                clearable
                class="custom-field"
                :rules="passwordRules"
              />
            </div>
            
            <!-- 确认密码 -->
            <div class="input-wrapper">
              <van-field
                v-model="registerForm.confirmPassword"
                name="confirmPassword"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
                :type="showConfirmPassword ? 'text' : 'password'"
                left-icon="lock"
                :right-icon="showConfirmPassword ? 'eye-o' : 'closed-eye'"
                @click-right-icon="showConfirmPassword = !showConfirmPassword"
                clearable
                class="custom-field"
                :rules="confirmPasswordRules"
              />
            </div>
            
            <!-- 邀请码（根据来源显示/隐藏） -->
            <div class="input-wrapper" v-if="!hasInviteCodeFromUrl">
              <van-field
                v-model="registerForm.invite_code"
                name="invite_code"
                :placeholder="$t('auth.inviteCodePlaceholder')"
                left-icon="gift-o"
                clearable
                class="custom-field"
              />
            </div>
            
            <!-- 隐藏的邀请码字段（当从URL获取时） -->
            <van-field
              v-if="hasInviteCodeFromUrl"
              v-model="registerForm.invite_code"
              name="invite_code"
              style="display: none;"
            />
          </div>

          <div class="agreement">
            <van-checkbox v-model="agreed" class="custom-checkbox">
              <span class="checkbox-text">
                {{ $t('auth.agreementText') }}
                <span class="link" @click="showAgreement">{{ $t('auth.userAgreement') }}</span>
                {{ $t('auth.and') }}
                <span class="link" @click="showPrivacy">{{ $t('auth.privacyPolicy') }}</span>
              </span>
            </van-checkbox>
          </div>

          <van-button 
            type="primary" 
            size="large" 
            block 
            :loading="loading"
            native-type="submit"
            class="submit-btn"
          >
            {{ $t('auth.register') }}
          </van-button>
        </van-form>
      </div>


    </div>
    <FloatingService />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FloatingService from '@/components/FloatingService/index.vue'
import { getAdvertise } from '@/api/slide'
import { useUserStore } from '@/store/modules/user'
import {useSiteStore} from "@/store/modules/site"
import { showToast, showDialog } from 'vant'
import { $t } from '@/locales'
import headerLogo from "@/assets/header_logo.png"
const router = useRouter()

const route = useRoute()
const userStore = useUserStore()
const siteStore = useSiteStore()
const mode = ref<'login' | 'register'>('login')
const loginType = ref<'username' | 'mobile'>('username')
const loading = ref(false)
const rememberMe = ref(false)
const agreed = ref(true)
const banners = ref<any>([])
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
  if(siteStore.banneList && siteStore.banneList.length) {
    banners.value = siteStore.banneList
  }else {
    try {
      // 轮播图（已由拦截器返回 data）
      const adv = await getAdvertise() as any
      banners.value = (adv || []).map((b: any, idx: number) => ({
        id: idx + 1,
        title: '',
        subtitle: '',
        image: b.image
      }))
      siteStore.setBannerList(banners.value)
    } catch (_) {
      console.error('获取轮播图失败')
    }
  }
  // 检查是否有邀请码参数
  if (route.query.invite_code) {
    registerForm.invite_code = route.query.invite_code as string
    hasInviteCodeFromUrl.value = true
    // 如果有邀请码，自动切换到注册模式
    if (mode.value === 'login') {
      mode.value = 'register'
    }
  }
  
  // 检查是否有 groupid 参数
  if (route.query.groupid) {
    registerForm.groupid = route.query.groupid as string
  }
  
  // 检查是否有 trid 参数
  if (route.query.trid) {
    registerForm.trid = route.query.trid as string
  }
  
  // 加载记住的密码
  loadRememberedPassword()
})

// 加载记住的密码
const loadRememberedPassword = () => {
  const rememberedData = localStorage.getItem('rememberedLogin')
  if (rememberedData) {
    try {
      const data = JSON.parse(rememberedData)
      if (data.type === 'mobile') {
        loginType.value = 'mobile'
        loginForm.mobile = data.mobile || ''
        loginForm.area_code = data.area_code || defaultAreaCode
      } else {
        loginType.value = 'username'
        loginForm.username = data.username || ''
      }
      loginForm.password = data.password || ''
      rememberMe.value = true
    } catch (error) {
      console.error('解析记住的密码数据失败:', error)
    }
  }
}

// 切换模式
const switchMode = (newMode: 'login' | 'register') => {
  mode.value = newMode
  if (newMode === 'login') {
    router.push({ name: 'Auth' })
  } else {
    router.push({ name: 'Auth', query: { mode: 'register' } })
  }
}

// 切换登录类型
const switchLoginType = (type: 'username' | 'mobile') => {
  loginType.value = type
  // 清空表单
  if (type === 'username') {
    loginForm.mobile = ''
    loginForm.area_code = defaultAreaCode
  } else {
    loginForm.username = ''
  }
}

// 登录表单
const loginForm = reactive({
  username: '',
  mobile: '',
  area_code: defaultAreaCode,
  password: ''
})

// 密码显示状态
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

// 是否有来自URL的邀请码
const hasInviteCodeFromUrl = ref(false)

// 注册表单
const registerForm = reactive({
  username: '',
  area_code: defaultAreaCode,
  mobile: '',
  password: '',
  confirmPassword: '',
  invite_code: '',
  groupid: '',
  trid: '',
  identifier:''
})

// 验证规则
const usernameRules = [
  { required: true, message: $t('auth.enterUsername') },
  { 
    validator: (val: string) => !val.includes(' '), 
    message: $t('auth.usernameNoSpaces') 
  },
  { 
    validator: (val: string) => val.length >= 3, 
    message: $t('auth.usernameMinLength') 
  }
]

const areaCodeRules = [
  { required: true, message: $t('auth.enterAreaCode') },
  { 
    pattern: /^\+?\d{1,4}$/, 
    message: $t('auth.enterCorrectAreaCode') 
  }
]

const mobileRules = [
  { required: true, message: $t('auth.enterMobile') },
  { 
    validator: (val: string) => validateMobileByAreaCode(val, registerForm.area_code),
    message: $t('auth.enterCorrectMobile') 
  }
]

const passwordRules = [
  { required: true, message: $t('auth.enterPassword') },
  { 
    validator: (val: string) => val.length >= 6, 
    message: $t('auth.passwordMinLength') 
  }
]

const confirmPasswordRules = [
  { required: true, message: $t('auth.confirmPassword') },
  { 
    validator: (val: string) => val === registerForm.password, 
    message: $t('auth.passwordMismatch') 
  }
]


// 登录处理
const handleLogin = async () => {
  // 验证必填字段
  if (loginType.value === 'username') {
    if (!loginForm.username || !loginForm.password) {
      showToast($t('auth.fillCompleteInfo'))
      return
    }
  } else {
    if (!loginForm.mobile || !loginForm.area_code || !loginForm.password) {
      showToast($t('auth.fillCompleteInfo'))
      return
    }
    
    // 验证手机号格式
    if (!validateMobileByAreaCode(loginForm.mobile, loginForm.area_code)) {
      showToast($t('auth.enterCorrectMobile'))
      return
    }
    
    // 验证区号格式
    if (!/^\+?\d{1,4}$/.test(loginForm.area_code)) {
      showToast($t('auth.enterCorrectAreaCode'))
      return
    }
  }
  
  loading.value = true
  try {
    if (loginType.value === 'username') {
      // 用户名登录
      await userStore.login(loginForm.username, loginForm.password)
    } else {
      // 手机号登录
      await userStore.loginWithMobile(loginForm.mobile, loginForm.area_code, loginForm.password)
    }
    
    // 处理记住密码
    if (rememberMe.value) {
      // 保存登录信息
      const loginData = {
        type: loginType.value,
        username: loginForm.username,
        mobile: loginForm.mobile,
        area_code: loginForm.area_code,
        password: loginForm.password
      }
      localStorage.setItem('rememberedLogin', JSON.stringify(loginData))
    } else {
      // 清除保存的登录信息
      localStorage.removeItem('rememberedLogin')
    }
    
    showToast($t('auth.loginSuccess'))
    router.push({ name: 'Home' })
  } catch (error) {
    showToast(error.msg || $t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  // 验证必填字段
  if (!registerForm.username || !registerForm.area_code || !registerForm.mobile || !registerForm.password || !registerForm.confirmPassword) {
    showToast($t('auth.fillCompleteInfo'))
    return
  }

  // 验证密码一致性
  if (registerForm.password !== registerForm.confirmPassword) {
    showToast($t('auth.passwordMismatch'))
    return
  }

  // 验证用户名规则
  if (registerForm.username.includes(' ')) {
    showToast($t('auth.usernameNoSpaces'))
    return
  }

  if (registerForm.username.length < 3) {
    showToast($t('auth.usernameMinLength'))
    return
  }

  // 验证区号格式
  if (!/^\+?\d{1,4}$/.test(registerForm.area_code)) {
    showToast($t('auth.enterCorrectAreaCode'))
    return
  }

  // 验证手机号格式
  if (!validateMobileByAreaCode(registerForm.mobile, registerForm.area_code)) {
    showToast($t('auth.enterCorrectMobile'))
    return
  }

  // 验证密码长度
  if (registerForm.password.length < 6) {
    showToast($t('auth.passwordMinLength'))
    return
  }

  if (!agreed.value) {
    showToast($t('auth.agreeTerms'))
    return
  }

  loading.value = true
  try {
    // 调用注册API，传递所有必要信息
    registerForm.identifier = siteStore.deviceId || localStorage.getItem('deviceId')
    await userStore.register(
      registerForm.username, 
      registerForm.password, 
      registerForm.invite_code,
      registerForm.mobile,
      registerForm.area_code,
      registerForm.groupid || undefined,
      registerForm.trid || undefined,
      registerForm.identifier
    )
    // 设置标记，首页将弹出手机验证（仅此一次）
    localStorage.setItem('need_mobile_verify', 'true')
    showToast($t('auth.registerSuccess'))
    router.push({ name: 'Home' })
  } catch (error) {
    showToast(error.msg || $t('auth.registerFailed'))
  } finally {
    loading.value = false
  }
}

// 短信登录
const handleSmsLogin = () => {
  showToast($t('auth.smsLoginDeveloping'))
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
