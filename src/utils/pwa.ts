// PWA工具类
import { showToast, showDialog } from 'vant'
import { getFCMToken, listenToMessages, isMessagingSupported } from './firebase'
import * as serviceApi from '@/api/service'
import { GAME_ID } from '@/config/firebase'
import { $t } from '@/locales'
import packageJson from '../../package.json'

// PWA安装提示状态
let deferredPrompt: any = null
let isInstalled = false

// 检查是否已安装PWA
export const checkPWAInstallation = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://')
}

// 检查Service Worker支持
export const checkServiceWorkerSupport = (): boolean => {
  return 'serviceWorker' in navigator
}

// 检查通知权限
export const checkNotificationPermission = (): NotificationPermission => {
  return Notification.permission
}

// 请求通知权限
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    showToast($t('pwaStatus.notificationNotSupported'))
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    showDialog({
      title: $t('pwaStatus.notificationDenied'),
      message: $t('pwaStatus.notificationDeniedMessage'),
      confirmButtonText: $t('common.understood')
    })
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      showToast($t('pwaStatus.notificationGranted'))
      // 获取FCM Token并更新到服务器
      await updateFCMToken()
      return true
    } else {
      showToast($t('pwaStatus.notificationDenied'))
      return false
    }
  } catch (error) {
    console.error('Request notification permission failed:', error)
    showToast($t('pwaStatus.requestNotificationFailed'))
    return false
  }
}

// 发送通知
export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/pwa_logo.png',
      badge: '/pwa_logo.png',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }
}

// 测试推送通知（通过Service Worker）
export const testPushNotification = async (): Promise<void> => {
  if (Notification.permission !== 'granted') {
    showToast($t('pwaStatus.requestNotificationFirst'))
    return
  }

  try {
    // 获取Service Worker注册
    const registration = await navigator.serviceWorker.ready
    
    // 发送消息给Service Worker触发推送
    if (registration.active) {
      registration.active.postMessage({
        type: 'TEST_PUSH',
        title: $t('pwaStatus.testNotification'),
        body: $t('pwaStatus.testNotificationBody'),
        icon: '/pwa_logo.png'
      })
      showToast($t('pwaStatus.testNotificationSent'))
    } else {
      showToast($t('pwaStatus.serviceWorkerNotReady'))
    }
  } catch (error) {
    console.error('Test push failed:', error)
    showToast($t('pwaStatus.testPushFailed'))
  }
}

// 订阅推送服务
export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (Notification.permission !== 'granted') {
    showToast($t('pwaStatus.requestNotificationFirst'))
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    
    // 使用VAPID公钥（这里使用一个测试公钥）
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI8Y8yA9uQzNswX8b8M8v4QyLvLQ1yKf0Bf7j6g5h4i3j2k1l0m9n8o7p6q5r4s3t2u1v0w9x8y7z6'
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as any
    })
    
    console.log('Push subscription successful:', subscription)
    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    showToast($t('pwaStatus.pushSubscriptionFailed'))
    return null
  }
}

// 将VAPID公钥转换为Uint8Array
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// 注册Service Worker
export const registerServiceWorker = async (): Promise<boolean> => {
  if (!checkServiceWorkerSupport()) {
    console.log('This browser does not support Service Worker')
    return false
  }

  try {
    const version = packageJson.version
    const registration = await navigator.serviceWorker.register(`/sw.js?v=${version}`)
    console.log('Service Worker registered successfully:', registration)
    
    // 监听Service Worker更新
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 检查是否真的有新版本（避免重复提示）
            const hasShownUpdate = sessionStorage.getItem('pwa-update-shown')
            if (!hasShownUpdate) {
              sessionStorage.setItem('pwa-update-shown', 'true')
              showUpdateDialog()
            }
          }
        })
      }
    })

    return true
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return false
  }
}

// 显示更新对话框
const showUpdateDialog = (): void => {
  showDialog({
    title: $t('pwaStatus.newVersionFound'),
    message: $t('pwaStatus.newVersionAvailable'),
    confirmButtonText: $t('pwaStatus.updateNow'),
    cancelButtonText: $t('pwaStatus.updateLater')
  }).then(() => {
    // 用户选择更新
    sessionStorage.removeItem('pwa-update-shown') // 清除标记
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }).catch(() => {
    // 用户选择稍后更新
    console.log('User chose to update later')
    // 5分钟后清除标记，允许再次提示
    setTimeout(() => {
      sessionStorage.removeItem('pwa-update-shown')
    }, 5 * 60 * 1000)
  })
}

// 检测是否是 iOS Safari
export const isIOSSafari = (): boolean => {
  const ua = window.navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua)
  return isIOS && isSafari
}

// 监听PWA安装提示
export const listenForInstallPrompt = (): void => {
  // 检查是否是 iOS Safari
  if (isIOSSafari() && !isInstalled) {
    // iOS Safari 需要手动安装，显示自定义提示
    showIOSInstallPrompt()
    return
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt triggered')
    e.preventDefault()
    deferredPrompt = e
    
    // 只在未安装时显示安装提示横条
    if (!isInstalled) {
      showInstallPrompt()
    }
  })

  // 监听PWA安装完成
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed')
    isInstalled = true
    deferredPrompt = null
    hideInstallBanner() // 隐藏安装提示横条
    showToast($t('pwaStatus.appInstalledSuccessfully'))
  })
}

// 显示 iOS Safari 安装提示
const showIOSInstallPrompt = (): void => {
  // 检查是否在7天内被关闭过
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime) {
    const dismissedDate = new Date(dismissedTime)
    const now = new Date()
    const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff < 7) {
      console.log('PWA install banner dismissed within 7 days, not showing')
      return
    }
  }
  
  // 创建 iOS 安装提示横条
  const installBanner = document.createElement('div')
  installBanner.id = 'pwa-install-banner'
  installBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 14px;
    ">
      <div id="pwa-banner-content" style="display: flex; align-items: center; flex: 1; cursor: pointer;">
        <div style="margin-right: 12px; font-size: 18px;">📱</div>
        <div>
          <div style="font-weight: 500; margin-bottom: 2px;">${$t('pwaStatus.installApp')}</div>
          <div style="font-size: 12px; opacity: 0.9;">${$t('pwaStatus.iosInstallHint')}</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="pwa-close-btn" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        " onmouseover="this.style.opacity='1'" 
           onmouseout="this.style.opacity='0.7'">
          ×
        </button>
      </div>
    </div>
  `
  
  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    #pwa-install-banner {
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    @keyframes slideUp {
      from { transform: translateY(0); }
      to { transform: translateY(-100%); }
    }
  `
  document.head.appendChild(style)
  
  // 添加到页面
  document.body.appendChild(installBanner)
  
  // 绑定横幅内容点击事件，点击后显示安装引导弹窗
  const bannerContent = document.getElementById('pwa-banner-content')
  if (bannerContent) {
    bannerContent.addEventListener('click', (e) => {
      e.stopPropagation()
      showIOSInstallDialog()
    })
  }
  
  // 绑定关闭事件，阻止事件冒泡
  const closeBtn = document.getElementById('pwa-close-btn')
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      hideInstallBannerWithDismiss()
    })
  }
}

// 显示安装提示横条
const showInstallPrompt = (): void => {
  // 检查是否在7天内被关闭过
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime) {
    const dismissedDate = new Date(dismissedTime)
    const now = new Date()
    const daysDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff < 7) {
      console.log('PWA install banner dismissed within 7 days, not showing')
      return
    }
  }
  
  // 创建安装提示横条
  const installBanner = document.createElement('div')
  installBanner.id = 'pwa-install-banner'
  installBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 14px;
    ">
      <div style="display: flex; align-items: center; flex: 1;">
        <div style="margin-right: 12px; font-size: 18px;">📱</div>
        <div>
          <div style="font-weight: 500; margin-bottom: 2px;">${$t('pwaStatus.installApp')}</div>
          <div style="font-size: 12px; opacity: 0.9;">${$t('pwaStatus.betterExperience')}</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="pwa-install-btn" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
           onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          ${$t('pwaStatus.installApp')}
        </button>
        <button id="pwa-close-btn" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        " onmouseover="this.style.opacity='1'" 
           onmouseout="this.style.opacity='0.7'">
          ×
        </button>
      </div>
    </div>
  `
  
  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    #pwa-install-banner {
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    @keyframes slideUp {
      from { transform: translateY(0); }
      to { transform: translateY(-100%); }
    }
  `
  document.head.appendChild(style)
  
  // 添加到页面
  document.body.appendChild(installBanner)
  
  // 绑定事件
  document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
    installPWA()
    hideInstallBanner()
  })
  
  document.getElementById('pwa-close-btn')?.addEventListener('click', hideInstallBannerWithDismiss)
}

// 隐藏安装提示横条
const hideInstallBanner = (): void => {
  const banner = document.getElementById('pwa-install-banner')
  if (banner) {
    banner.style.animation = 'slideUp 0.3s ease-out forwards'
    setTimeout(() => {
      banner.remove()
    }, 300)
  }
}

// 隐藏安装提示横条并记录关闭时间
const hideInstallBannerWithDismiss = (): void => {
  // 记录关闭时间，7天内不再显示
  localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
  hideInstallBanner()
}

// 安装PWA
export const installPWA = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    showToast($t('pwaStatus.browserNotSupported'))
    return false
  }

  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted install prompt')
      showToast($t('pwaStatus.installing'))
      return true
    } else {
      console.log('User dismissed install prompt')
      return false
    }
  } catch (error) {
    console.error('Failed to install PWA:', error)
    showToast($t('pwaStatus.installFailed'))
    return false
  }
}

// 检查更新
export const checkForUpdates = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.update()
      }
    })
  }
}

// 初始化PWA
export const initPWA = async (): Promise<void> => {
  console.log('Initializing PWA...')
  
  // 检查是否已安装
  isInstalled = checkPWAInstallation()
  
  // 注册Service Worker
  await registerServiceWorker()
  
  // 监听安装提示
  listenForInstallPrompt()
  
  console.log('PWA initialization completed')
}

// 用户登录后初始化通知权限
export const initNotificationAfterLogin = async (): Promise<void> => {
  console.log('Initializing notification after login...')
  
  // 请求通知权限
  await requestNotificationPermission()
  
  console.log('Notification initialization after login completed')
}

// 更新FCM Token到服务器
export const updateFCMToken = async (): Promise<void> => {
  // 先检查浏览器是否支持 Firebase Messaging
  const supported = await isMessagingSupported()
  if (!supported) {
    console.warn('当前浏览器不支持 Firebase Messaging，跳过 FCM Token 更新')
    return
  }
  
  try {
    const token = await getFCMToken()
    console.log('FCM Token:', token)
    
    // 更新Token到服务器
    await serviceApi.updateToken({ 
      put_token: token, 
      game_id: GAME_ID
    })
    
    console.log('FCM Token updated to server')
    
    // 设置消息监听
    await listenToMessages((payload) => {
      console.log('Received FCM message:', payload)
      // 可以在这里处理接收到的消息
      if (payload.notification) {
        sendNotification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
          badge: payload.notification.badge
        })
      }
    })
    
  } catch (error) {
    console.error('Failed to update FCM Token:', error)
  }
}

// 显示 iOS 安装引导弹窗
export const showIOSInstallDialog = (): void => {
  showDialog({
    title: $t('pwaStatus.installApp'),
    message: $t('pwaStatus.iosInstallHint'),
    confirmButtonText: $t('common.understood'),
    showCancelButton: false
  })
}

// 处理下载/安装App
export const handleDownloadApp = async (): Promise<void> => {
  // 检查是否已安装
  if (checkPWAInstallation()) {
    showToast($t('pwaStatus.installed'))
    return
  }

  // 如果是iOS，显示引导弹窗
  if (isIOSSafari()) {
    showIOSInstallDialog()
    return
  }

  // 安卓或其他支持PWA的浏览器，尝试安装
  if (deferredPrompt) {
    await installPWA()
  } else {
    showToast($t('pwaStatus.browserNotSupported'))
  }
}

// 获取PWA状态
export const getPWAStatus = () => {
  return {
    isInstalled,
    hasServiceWorker: checkServiceWorkerSupport(),
    notificationPermission: checkNotificationPermission(),
    canInstall: !!deferredPrompt
  }
}
