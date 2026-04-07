// 缓存清理工具
export const clearAllCaches = async (): Promise<void> => {
  try {
    // 1. 清除 Service Worker 缓存
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        // 先更新 Service Worker
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
        // 然后注销
        await registration.unregister()
      }
    }
    
    // 2. 清除浏览器缓存
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    // 3. 清除 localStorage 中的缓存相关数据
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.includes('cache') || 
        key.includes('sw') || 
        key.includes('workbox') ||
        key.includes('pwa') ||
        key.includes('update')
      )) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // 4. 清除 sessionStorage 中的缓存
    const sessionKeysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (
        key.includes('cache') || 
        key.includes('sw') || 
        key.includes('workbox') ||
        key.includes('pwa') ||
        key.includes('update')
      )) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    console.log('缓存清理完成')
    
  } catch (error) {
    console.error('清除缓存失败:', error)
    throw error
  }
}

// 语言切换后的完整清理和刷新流程
export const switchLanguageAndReload = async (): Promise<void> => {
  try {
    // 立即更新所有可能的语言状态，确保后续请求使用新语言
    const newLang = localStorage.getItem('lang')
    if (newLang) {
      // 更新 document 的 lang 属性
      document.documentElement.lang = newLang
      
      // 更新 meta 标签
      let metaLang = document.querySelector('meta[name="lang"]')
      if (!metaLang) {
        metaLang = document.createElement('meta')
        metaLang.setAttribute('name', 'lang')
        document.head.appendChild(metaLang)
      }
      metaLang.setAttribute('content', newLang)
    }
    
    await clearAllCaches()
    
    // 刷新页面
    window.location.reload()
 
  } catch (error) {
    console.error('语言切换清理失败:', error)
    // 即使清理失败也要刷新
  }
}
