<template>
  <div class="settings-page">
    <!-- 设置列表 -->
    <div class="settings-list">
      <van-cell-group>
        <!-- 设置昵称 -->
        <van-cell 
          :title="$t('settings.setNickname')" 
          :value="userStore.userInfo?.nickname || $t('settings.notSet')"
          icon="user-o" 
          is-link 
          @click="showNicknameDialog = true"
        />
        
        <!-- 语言设置 -->
        <van-cell 
          :title="$t('settings.language')" 
          :value="getCurrentLanguageName()"
          is-link 
          @click="showLanguagePicker = true"
        >
          <template #icon>
            <svg-icon class="text-[18px] mr-[12px]" name="lang" />
          </template>
        </van-cell>
        
        <!-- 修改登录密码 -->
        <van-cell 
          :title="$t('settings.changeLoginPassword')" 
          icon="lock" 
          is-link 
          @click="showChangePasswordDialog = true"
        />
        
        <!-- 修改交易密码 -->
        <van-cell 
          :title="$t('settings.changePayPassword')" 
          icon="balance-pay" 
          is-link 
          @click="handlePayPasswordClick"
        />
        
        <!-- 手机验证 -->
        <van-cell 
          :title="$t('settings.mobileVerify' as any)" 
          :value="getMobileStatus()"
          icon="phone-o" 
          is-link 
          @click="handleMobileVerifyClick"
        />
        
        <!-- 清除缓存 -->
        <van-cell 
          :title="$t('settings.clearCache' as any)" 
          icon="delete-o" 
          is-link 
          @click="handleClearCache"
        />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button 
        type="danger" 
        size="large" 
        block 
        @click="handleLogout"
        class="logout-btn"
      >
        {{ $t('profile.logout') }}
      </van-button>
    </div>

    <!-- 昵称设置对话框 -->
    <NicknameDialog 
      :show="showNicknameDialog" 
      @close="showNicknameDialog = false"
      @success="handleNicknameSuccess"
    />

    <!-- 修改登录密码对话框 -->
    <ChangePasswordDialog 
      :show="showChangePasswordDialog" 
      @close="showChangePasswordDialog = false"
      @success="handlePasswordSuccess"
    />

    <!-- 修改交易密码对话框 -->
    <ChangePayPasswordDialog 
      :show="showChangePayPasswordDialog" 
      @close="showChangePayPasswordDialog = false"
      @success="handlePayPasswordSuccess"
    />

    <!-- 设置交易密码对话框 -->
    <SetPayPasswordDialog 
      :show="showSetPayPasswordDialog" 
      @close="showSetPayPasswordDialog = false"
      @success="handleSetPayPasswordSuccess"
    />

    <!-- 语言选择器 -->
    <van-popup 
      v-model:show="showLanguagePicker" 
      position="bottom"
      round
    >
      <div class="language-picker">
        <div class="picker-header">
          <h3>{{ $t('settings.selectLanguage') }}</h3>
        </div>
        <van-picker
          :columns="languageOptions"
          @confirm="onLanguageConfirm"
          @cancel="showLanguagePicker = false"
        />
      </div>
    </van-popup>

    <!-- 手机验证组件 -->
    <MobileVerify 
      v-model:show="showMobileVerifyDialog"
      @success="handleMobileVerifySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { setLocale, $t, $locale } from '@/locales'
import { switchLanguageAndReload } from '@/utils/cache-cleaner'
import NicknameDialog from '@/components/NicknameDialog/index.vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog/index.vue'
import ChangePayPasswordDialog from '@/components/ChangePayPasswordDialog/index.vue'
import MobileVerify from '@/components/MobileVerify/index.vue'
import SetPayPasswordDialog from '@/components/SetPayPasswordDialog/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import packageJson from '../../../package.json'

const router = useRouter()
const userStore = useUserStore()

const showNicknameDialog = ref(false)
const showLanguagePicker = ref(false)
const showChangePasswordDialog = ref(false)
const showChangePayPasswordDialog = ref(false)
const showSetPayPasswordDialog = ref(false)
const showMobileVerifyDialog = ref(false)

// 语言选项
const languageOptions = [
  {
    text: $t('language.chinese'),
    value: 'zh-cn'
  },
  {
    text: $t('language.english'),
    value: 'en-us'
  },
  {
    text: $t('language.vietnamese'),
    value: 'yuenan'
  }
]

// 获取当前语言名称
const getCurrentLanguageName = () => {
  const currentLang = $locale.value // 使用当前实际的语言值
  const option = languageOptions.find(opt => opt.value === currentLang)
  return option?.text || $t('language.chinese')
}

// 昵称设置成功回调
const handleNicknameSuccess = async () => {
  showToast($t('settings.nicknameUpdated'))
  // 刷新用户信息
  try {
    await userStore.fetchUserInfo()
  } catch (error) {
    console.error('刷新用户信息失败:', error)
  }
}

// 修改登录密码成功回调
const handlePasswordSuccess = () => {
  showToast($t('changePassword.success'))
}

// 处理交易密码点击
const handlePayPasswordClick = () => {
  // 检查用户是否已设置交易密码
  if (userStore.userInfo?.isWithdrawPwd) {
    // 已设置，显示修改交易密码对话框
    showChangePayPasswordDialog.value = true
  } else {
    // 未设置，显示设置交易密码对话框
    showSetPayPasswordDialog.value = true
  }
}

// 修改交易密码成功回调
const handlePayPasswordSuccess = () => {
  showToast($t('changePayPassword.success'))
  // 刷新用户信息
  userStore.fetchUserInfo()
}

// 设置交易密码成功回调
const handleSetPayPasswordSuccess = () => {
  showToast($t('setPayPassword.success'))
  // 刷新用户信息
  userStore.fetchUserInfo()
}

// 退出登录
const handleLogout = () => {
  showDialog({
    title: $t('profile.confirmLogout'),
    message: $t('profile.confirmLogoutMessage'),
    confirmButtonText: $t('common.confirm'),
    cancelButtonText: $t('common.cancel')
  }).then(async () => {
    try {
      await userStore.logout()
      showToast($t('profile.loggedOut'))
      // 跳转到登录页面
      router.push({ name: 'Auth' })
    } catch (error) {
      console.error('退出登录失败:', error)
      showToast(error.msg || $t('profile.logoutFailed'))
    }
  }).catch(() => {
    // 用户取消退出
  })
}

// 语言选择确认
const onLanguageConfirm = async ({ selectedOptions }: any) => {
  const selectedLang = selectedOptions[0].value
  const currentLang = localStorage.getItem('lang')
  
  if (selectedLang !== currentLang) {
    setLocale(selectedLang as any)
    showToast($t('language.languageChanged'))
    showLanguagePicker.value = false
    await switchLanguageAndReload()
  } else {
    showLanguagePicker.value = false
  }
}

// 跳转到通知设置
const goToNotificationSettings = () => {
  showToast($t('settings.notificationSettingsDeveloping'))
}

// 跳转到隐私设置
const goToPrivacySettings = () => {
  showToast($t('settings.privacySettingsDeveloping'))
}

// 跳转到关于页面
const goToAbout = () => {
  showToast($t('settings.aboutDeveloping'))
}

// 清除所有缓存
const clearAllCache = async () => {
  try {
    // 1. 清除Service Worker缓存
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
    }
    
    // 2. 清除Cache API缓存
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    // 3. 清除localStorage
    localStorage.clear()
    
    // 4. 清除sessionStorage
    sessionStorage.clear()
    
    // 5. 清除IndexedDB（如果存在）
    if ('indexedDB' in window) {
      try {
        // 尝试清除所有数据库
        const databases = await indexedDB.databases()
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name)
                deleteReq.onsuccess = () => resolve(true)
                deleteReq.onerror = () => reject(deleteReq.error)
              })
            }
          })
        )
      } catch (error) {
        console.warn('清除IndexedDB失败:', error)
      }
    }
    
    // 6. 重新注册Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const version = packageJson.version
        await navigator.serviceWorker.register(`/sw.js?v=${version}`)
      } catch (error) {
        console.warn('重新注册Service Worker失败:', error)
      }
    }
    
    console.log('所有缓存已清除')
  } catch (error) {
    console.error('清除缓存过程中出错:', error)
    throw error
  }
}

// 清除缓存
const handleClearCache = async () => {
  try {
    await clearAllCache()
    showToast($t('settings.clearCacheSuccess' as any))
  } catch (error) {
    console.error('清除缓存失败:', error)
    showToast($t('settings.clearCacheFailed' as any))
  }
}

// 获取手机状态
const getMobileStatus = () => {
  if (userStore.userInfo?.is_mobile) {
    return $t('settings.verified' as any)
  }
  return $t('settings.notVerified' as any)
}

// 处理手机验证点击
const handleMobileVerifyClick = () => {
  // 如果已经验证过手机号，直接提示已验证
  if (userStore.userInfo?.is_mobile) {
    showToast($t('settings.alreadyVerified' as any))
    return
  }
  
  // 显示手机验证弹窗
  showMobileVerifyDialog.value = true
}

// 手机验证成功回调
const handleMobileVerifySuccess = () => {
  showToast($t('settings.operationSuccess' as any))
}

</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16px;
}

.settings-list {
  margin-bottom: 20px;
}

.language-picker {
  padding: 20px;
}

.picker-header {
  text-align: center;
  margin-bottom: 20px;
}

.picker-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.logout-section {
  margin-top: 20px;
  padding: 0 16px;
}

.logout-btn {
  border-radius: 8px;
  font-weight: 500;
}

</style>
