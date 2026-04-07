<template>
  <div class="user-card">
    <div class="user-avatar" @click="showAvatarDialog">
      <img 
        v-if="user.avatar && user.avatar.trim() !== ''" 
        :src="user.avatar" 
        :alt="user.username"
        @error="handleImageError"
      />
      <div v-else class="avatar-placeholder">
        {{ getInitials(user.nickname || user.username) }}
      </div>
      <div class="avatar-edit-icon">
        <van-icon name="photograph" size="16" />
      </div>
    </div>
    <div class="user-info">
      <div class="user-header">
        <h3 class="user-name">{{ user.nickname || user.username }}</h3>
        <div class="user-level" @click="goToVip">{{ user.level_info?.name || 'VIP0' }}</div>
      </div>
      <p class="user-phone" v-if="user.mobile">
        +{{ user.area_code }} {{ maskMobile(user.mobile) }}
        <span v-if="user.is_mobile" class="verified-icon">✓</span>
        <span v-else class="unverified-icon" @click="showMobileVerify">⚠</span>
      </p>
      
      <div class="invite-section">
        <div class="invite-code" @click="copyInviteCode">
          <span class="invite-label">{{ $t('userCard.inviteCode') }}</span>
          <span class="invite-value">{{ user.invite_code }}</span>
          <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
    </div>

    <!-- 头像选择弹窗 -->
    <van-popup
      v-model:show="showAvatarPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="avatar-dialog">
        <div class="dialog-header">
          <h3>{{ $t('userCard.selectAvatar') }}</h3>
          <van-icon name="cross" @click="showAvatarPopup = false" />
        </div>
        
        <div class="avatar-options">
          <!-- 系统头像 -->
          <div class="system-avatars">
            <h4>{{ $t('userCard.systemAvatars') }}</h4>
            <div class="avatar-grid">
              <div
                v-for="index in 90"
                :key="index"
                class="avatar-option"
                :class="{ active: selectedAvatar === index }"
                @click="selectSystemAvatar(index)"
              >
                <img :src="`/static/avatar/new/${index}.png`" :alt="`Avatar ${index}`" />
              </div>
            </div>
          </div>
          
          <!-- 上传自定义头像 -->
          <div class="upload-section">
            <h4>{{ $t('userCard.customAvatar') }}</h4>
            <div class="upload-btn" @click="uploadCustomAvatar">
              <van-icon name="plus" size="16" />
              <span>{{ $t('userCard.upload') }}</span>
            </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <van-button type="default" @click="showAvatarPopup = false">{{ $t('common.cancel') }}</van-button>
          <van-button type="primary" @click="confirmAvatar" :loading="uploading">{{ $t('common.confirm') }}</van-button>
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { UserInfo } from '@/store/modules/user'
import { showToast } from 'vant'
import { updateAvatar, fileUpload } from '@/api/service'
import { useUserStore } from '@/store/modules/user'
import { $t } from '@/locales'
import MobileVerify from '@/components/MobileVerify/index.vue'

interface Props {
  user: UserInfo
}

const props = defineProps<Props>()
const router = useRouter()
const userStore = useUserStore()

// 头像选择相关状态
const showAvatarPopup = ref(false)
const selectedAvatar = ref<number | null>(null)
const uploading = ref(false)

// 手机验证相关状态
const showMobileVerifyDialog = ref(false)

const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(props.user.invite_code)
    showToast($t('userCard.inviteCodeCopied'))
  } catch (error) {
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea')
    textArea.value = props.user.invite_code
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('userCard.inviteCodeCopied'))
  }
}

// 获取用户名首字母
const getInitials = (name: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

// 隐藏手机号码中间4位
const maskMobile = (mobile: string) => {
  if (!mobile || mobile.length < 5) return mobile

  const firstChar = mobile.charAt(0)
  const lastFour = mobile.slice(-4)
  const middleStars = '*'.repeat(4)

  return firstChar + middleStars + lastFour
}

// 显示头像选择弹窗
const showAvatarDialog = () => {
  showAvatarPopup.value = true
}

// 跳转到VIP页面
const goToVip = () => {
  router.push({ name: 'Vip' })
}

// 显示手机验证弹窗
const showMobileVerify = () => {
  showMobileVerifyDialog.value = true
}

// 手机验证成功回调
const handleMobileVerifySuccess = () => {
  showToast($t('settings.operationSuccess' as any))
}

// 选择系统头像
const selectSystemAvatar = (index: number) => {
  selectedAvatar.value = index
}

// 上传自定义头像
const uploadCustomAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      uploading.value = true
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const res = await fileUpload(formData)
        if (res && res.url) {
          // 上传成功，更新头像
          await updateUserAvatar(res.url)
        } else {
          showToast($t('userCard.uploadFailed'))
        }
      } catch (error) {
        console.error('Upload avatar failed:', error)
        showToast(error.msg || $t('userCard.uploadFailed'))
      } finally {
        uploading.value = false
      }
    }
  }
  input.click()
}

// 确认头像选择
const confirmAvatar = async () => {
  if (selectedAvatar.value) {
    uploading.value = true
    try {
      const avatarUrl = `${window.location.origin}/static/avatar/new/${selectedAvatar.value}.png`
      await updateUserAvatar(avatarUrl)
    } catch (error) {
      console.error('Update avatar failed:', error)
      showToast(error.msg || $t('userCard.updateAvatarFailed'))
    } finally {
      uploading.value = false
    }
  } else {
    showToast($t('userCard.pleaseSelectAvatar'))
  }
}

// 更新用户头像
const updateUserAvatar = async (avatarUrl: string) => {
  try {
    const res = await updateAvatar({ avatar: avatarUrl })
    if (res) {
      // 更新本地用户信息
      await userStore.fetchUserInfo()
      showToast($t('userCard.avatarUpdateSuccess'))
      showAvatarPopup.value = false
    } else {
      showToast(res?.msg || $t('userCard.updateAvatarFailed'))
    }
  } catch (error) {
    console.error('Update avatar failed:', error)
    showToast(error.msg || $t('userCard.updateAvatarFailed'))
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 显示默认头像
  const placeholder = img.nextElementSibling as HTMLElement
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

const generateInviteLink = async () => {
  const baseUrl = window.location.origin
  const inviteLink = `${baseUrl}/#/auth?mode=register&invite_code=${props.user.invite_code}`
  
  try {
    await navigator.clipboard.writeText(inviteLink)
    showToast($t('userCard.inviteLinkCopied'))
  } catch (error) {
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea')
    textArea.value = inviteLink
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('userCard.inviteLinkCopied'))
  }
}
</script>

<style scoped>
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-info {
  flex: 1;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.user-level {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.user-phone {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.verified-icon {
  background: #52c41a;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(82, 196, 26, 0.3);
}

.unverified-icon {
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(255, 77, 79, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 4px;
}

.unverified-icon:hover {
  background: #ff7875;
  transform: scale(1.1);
}

.unverified-icon:active {
  transform: scale(0.95);
}

.invite-section {
  margin-bottom: 12px;
}

.invite-code {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite-code:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.02);
}

.invite-label {
  font-size: 12px;
  opacity: 0.8;
}

.invite-value {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
}

.copy-icon {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.invite-code:hover .copy-icon {
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* 头像选择弹窗样式 */
.avatar-dialog {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.avatar-options {
  flex: 1;
  overflow-y: auto;
}

.system-avatars h4,
.upload-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.avatar-option {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-section {
  margin-top: 20px;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #999;
}

.upload-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.upload-btn span {
  font-size: 8px;
  margin-top: 1px;
  line-height: 1;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.dialog-actions .van-button {
  flex: 1;
}

.invite-link {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.02);
}

.invite-link .invite-label {
  font-size: 12px;
  opacity: 0.8;
}

.invite-link .copy-icon {
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.invite-link:hover .copy-icon {
  opacity: 1;
}

</style>
