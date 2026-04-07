import { getChatLogin, getIMGuest } from '@/api/service'
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
/**
 * IM链接缓存工具
 * 提供统一的IM链接获取和缓存管理功能
 */

// 缓存配置
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7天

/**
 * 获取IM聊天链接（带缓存）
 * @returns Promise<string> IM链接
 */
let pendingChatLinkPromise: Promise<string> | null = null

export const getIMChatLink = async (): Promise<string> => {
  if (pendingChatLinkPromise) {
    return pendingChatLinkPromise
  }

  pendingChatLinkPromise = (async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const isLoggedIn = !!token

      // 构建缓存key
      const cacheKey = `im_chat_link_${isLoggedIn ? 'user' : 'guest'}`
      const cacheTimeKey = `im_chat_time_${isLoggedIn ? 'user' : 'guest'}`

      // 检查缓存是否存在且未过期
      const cachedLink = localStorage.getItem(cacheKey)
      const cachedTime = localStorage.getItem(cacheTimeKey)
      const now = Date.now()

      if (cachedLink && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
        console.log('使用缓存的IM链接:', cachedLink)
        return cachedLink
      }

      console.log('缓存不存在或已过期，重新获取IM链接')

      // 获取新的IM链接
      let res = null
      if (isLoggedIn) {
        // 登录用户，获取聊天链接
        console.log('调用getChatLogin...')
        res = await getChatLogin()
      } else {
        // 游客，获取游客聊天链接
        console.log('调用getIMGuest...')
        res = await getIMGuest()
      }

      const link = (res as any)?.link

      // 缓存链接和时间戳
      if (link) {
        localStorage.setItem(cacheKey, link)
        localStorage.setItem(cacheTimeKey, now.toString())
        console.log('IM链接已缓存，有效期7天')
      }

      return link || ''
    } finally {
      pendingChatLinkPromise = null
    }
  })()

  return pendingChatLinkPromise
}

/**
 * 清除IM链接缓存
 */
export const clearIMCache = (): void => {
  localStorage.removeItem('im_chat_link_user')
  localStorage.removeItem('im_chat_link_guest')
  localStorage.removeItem('im_chat_time_user')
  localStorage.removeItem('im_chat_time_guest')
  useCachedViewStoreHook().delAllCachedViews()
  console.log('IM链接缓存已清除')
}

/**
 * 清除登录用户的IM链接缓存
 * 在用户退出登录时调用
 */
export const clearUserIMCache = (): void => {
  localStorage.removeItem('im_chat_link_user')
  localStorage.removeItem('im_chat_time_user')
  useCachedViewStoreHook().delAllCachedViews()
  console.log('登录用户IM链接缓存已清除')
}

/**
 * 检查IM链接缓存是否存在且有效
 * @returns boolean 缓存是否有效
 */
export const isIMCacheValid = (): boolean => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const isLoggedIn = !!token
  
  const cacheKey = `im_chat_link_${isLoggedIn ? 'user' : 'guest'}`
  const cacheTimeKey = `im_chat_time_${isLoggedIn ? 'user' : 'guest'}`
  
  const cachedLink = localStorage.getItem(cacheKey)
  const cachedTime = localStorage.getItem(cacheTimeKey)
  const now = Date.now()
  
  return !!(cachedLink && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION)
}

/**
 * 获取缓存的IM链接（不进行API调用）
 * @returns string | null 缓存的链接或null
 */
export const getCachedIMLink = (): string | null => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const isLoggedIn = !!token
  
  const cacheKey = `im_chat_link_${isLoggedIn ? 'user' : 'guest'}`
  const cacheTimeKey = `im_chat_time_${isLoggedIn ? 'user' : 'guest'}`
  
  const cachedLink = localStorage.getItem(cacheKey)
  const cachedTime = localStorage.getItem(cacheTimeKey)
  const now = Date.now()
  
  if (cachedLink && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
    return cachedLink
  }
  
  return null
}
