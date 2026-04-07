<template>
  <div class="pwa-status">
    <van-cell-group>
      <van-cell :title="$t('pwaStatus.pwaStatus')" :value="statusText" />
      <van-cell :title="$t('pwaStatus.notificationPermission')" :value="notificationStatus" />
      <van-cell :title="$t('pwaStatus.serviceWorker')" :value="swStatus" />
      <van-cell :title="$t('pwaStatus.installStatus')" :value="installStatus" />
    </van-cell-group>
    
    <div class="pwa-actions">
      <van-button 
        v-if="!pwaStatus.isInstalled && pwaStatus.canInstall" 
        type="primary" 
        block 
        @click="handleInstall"
      >
        {{ $t('pwaStatus.installApp') }}
      </van-button>
      
      <van-button 
        v-if="pwaStatus.notificationPermission !== 'granted'" 
        type="success" 
        block 
        @click="handleRequestNotification"
      >
        {{ $t('pwaStatus.requestNotification') }}
      </van-button>
      
      <van-button 
        type="default" 
        block 
        @click="handleCheckUpdate"
      >
        {{ $t('pwaStatus.checkUpdate') }}
      </van-button>
      
      <van-button 
        type="default" 
        block 
        @click="handleSendTestNotification"
      >
        {{ $t('pwaStatus.sendTestNotification') }}
      </van-button>
      
      <van-button 
        type="warning" 
        block 
        @click="handleTestPushNotification"
      >
        {{ $t('pwaStatus.testPushNotification') }}
      </van-button>
      
      <van-button 
        type="default" 
        block 
        @click="handleSubscribeToPush"
      >
        {{ $t('pwaStatus.subscribePush') }}
      </van-button>
      
      <van-button 
        type="default" 
        block 
        @click="handleUpdateFCMToken"
      >
        {{ $t('pwaStatus.updateFCMToken') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { 
  getPWAStatus, 
  installPWA, 
  requestNotificationPermission, 
  sendNotification,
  testPushNotification,
  subscribeToPush,
  checkForUpdates,
  updateFCMToken
} from '@/utils/pwa'
import { $t } from '@/locales'

// 响应式数据
const pwaStatus = ref(getPWAStatus())

// 计算属性
const statusText = computed(() => {
  return pwaStatus.value.isInstalled ? $t('pwaStatus.installed') : $t('pwaStatus.notInstalled')
})

const notificationStatus = computed(() => {
  switch (pwaStatus.value.notificationPermission) {
    case 'granted':
      return $t('pwaStatus.granted')
    case 'denied':
      return $t('pwaStatus.denied')
    case 'default':
      return $t('pwaStatus.notRequested')
    default:
      return $t('pwaStatus.unknown')
  }
})

const swStatus = computed(() => {
  return pwaStatus.value.hasServiceWorker ? $t('pwaStatus.registered') : $t('pwaStatus.notSupported')
})

const installStatus = computed(() => {
  return pwaStatus.value.isInstalled ? $t('pwaStatus.installed') : $t('pwaStatus.canInstall')
})

// 方法
const handleInstall = async () => {
  const success = await installPWA()
  if (success) {
    showToast($t('pwaStatus.installing'))
    updateStatus()
  }
}

const handleRequestNotification = async () => {
  const success = await requestNotificationPermission()
  if (success) {
    showToast($t('pwaStatus.notificationGranted'))
    updateStatus()
  }
}

const handleCheckUpdate = () => {
  checkForUpdates()
  showToast($t('pwaStatus.checkingUpdate'))
}

const handleSendTestNotification = () => {
  if (pwaStatus.value.notificationPermission === 'granted') {
    sendNotification($t('pwaStatus.testNotification'), {
      body: $t('pwaStatus.testNotificationBody'),
      tag: 'test-notification'
    })
    showToast($t('pwaStatus.testNotificationSent'))
  } else {
    showToast($t('pwaStatus.requestNotificationFirst'))
  }
}

const handleTestPushNotification = async () => {
  await testPushNotification()
}

const handleSubscribeToPush = async () => {
  const subscription = await subscribeToPush()
  if (subscription) {
    showToast($t('pwaStatus.pushSubscriptionSuccess'))
    console.log('推送订阅信息:', subscription)
  }
}

const handleUpdateFCMToken = async () => {
  try {
    // showToast('正在更新FCM Token...')
    await updateFCMToken()
    // showToast('FCM Token更新成功')
  } catch (error) {
    console.error('更新FCM Token失败:', error)
    // showToast('FCM Token更新失败')
  }
}

const updateStatus = () => {
  pwaStatus.value = getPWAStatus()
}

// 生命周期
onMounted(() => {
  updateStatus()
  
  // 监听PWA状态变化
  window.addEventListener('appinstalled', updateStatus)
  window.addEventListener('beforeinstallprompt', updateStatus)
})
</script>

<style scoped>
.pwa-status {
  padding: 16px;
}

.pwa-actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
