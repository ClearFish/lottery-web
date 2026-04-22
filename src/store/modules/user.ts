import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSiteStore } from "@/store/modules/site";
export interface UserInfo {
  id: number
  agent_id: number
  username: string
  nickname: string
  area_code: number
  mobile: string
  avatar: string
  level: number
  money: string
  score: number
  is_recharge: number
  is_mobile: number
  is_audit: number
  is_official: number
  trid: string
  friend_msg: string
  token: string
  user_id: string
  expiretime: number
  expires_in: number
  level_info: {
    name: string
    promotion_money: string
    level: number
    invite_allow: number
    withdraw_max: string
    withdraw_min: string
    withdraw_finish_order: number
    withdraw_number: number
    invite_ratio: Record<string, string>
    icon: string
  }
  isWithdrawPwd: boolean
  Balances: Array<{
    currency: string
    symbo: string
    balance: string
    icon: string
    rate: number
  }>
  info: any[]
  invite_code: string
  today_profit: string
  total_profit: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem('user')) || null)
  const isLoggedIn = ref(false)
  const token = ref('')
  const isLoadingUserInfo = ref(false)
  let pendingUserInfoRequest: Promise<any> | null = null
  const siteStore = useSiteStore()

  // 计算属性
  const balance = computed(() => parseFloat(userInfo.value?.money || '0'))
  const todayEarnings = computed(() => parseFloat(userInfo.value?.today_profit || '0'))
  const totalEarnings = computed(() => parseFloat(userInfo.value?.total_profit || '0'))
  const levelName = computed(() => userInfo.value?.level_info?.name || 'VIP0')
  const inviteCode = computed(() => userInfo.value?.invite_code || '')
  const systemBalance = computed(() => {
    const systemBalance = userInfo.value?.Balances?.find(b => b.currency === 'SYSTEM')
    return systemBalance ? parseFloat(systemBalance.balance) : 0
  })
  const usdtBalance = computed(() => {
    const usdtBalance = userInfo.value?.Balances?.find(b => b.currency === 'USDT')
    return usdtBalance ? parseFloat(usdtBalance.balance) : 0
  })

  // 方法
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('user',JSON.stringify(userInfo.value))
    isLoggedIn.value = true
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const login = async (fromVal:any) => {
    try {
      const { login: loginApi } = await import('@/api/auth')
      const response = await loginApi(fromVal) as any
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      setToken(response.token)
      
      // 登录成功后获取完整的用户信息
      const userInfo = await fetchUserInfo()
      // 登录成功后初始化通知权限
      // const { initNotificationAfterLogin } = await import('@/utils/pwa')
      // await initNotificationAfterLogin()
      
      return userInfo
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  const loginWithMobile = async (mobile: string, area_code: string, password: string) => {
    try {
      const { login: loginApi } = await import('@/api/auth')
      const response = await loginApi({ mobile, area_code, password }) as any
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      setToken(response.token)
      
      // 登录成功后获取完整的用户信息
      const userInfo = await fetchUserInfo()
      
      // 登录成功后初始化通知权限
      // const { initNotificationAfterLogin } = await import('@/utils/pwa')
      // await initNotificationAfterLogin()
      
      return userInfo
    } catch (error) {
      console.error('手机号登录失败:', error)
      throw error
    }
  }

  const register = async (username: string, password: string, invite_code?: string, mobile?: string, area_code?: string, groupid?: string, trid?: string,identifier?:string) => {
    try {
      const { register,identifierFS } = await import('@/api/auth')
      const response = await register({ username, password, invite_code, mobile, area_code, groupid, trid, identifier }) as any
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      
      setToken(response.userinfo.token)
      setUserInfo(response.userinfo)
      await identifierFS({identifier})
       localStorage.setItem('hasIdentify','true')
      // 注册成功后初始化通知权限
      // const { initNotificationAfterLogin } = await import('@/utils/pwa')
      // await initNotificationAfterLogin()
      
      return response.userinfo
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { logout } = await import('@/api/auth')
      await logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      userInfo.value = null
      isLoggedIn.value = false
      token.value = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user');
      localStorage.removeItem('hasIdentify')
      // 清除登录用户的IM链接缓存
      const { clearUserIMCache } = await import('@/utils/im-cache')
      clearUserIMCache()
    }
  }

  const updateBalance = (amount: number) => {
    if (userInfo.value) {
      const currentBalance = parseFloat(userInfo.value.money)
      userInfo.value.money = String(currentBalance + amount)
    }
  }

  const updateEarnings = (amount: number) => {
    if (userInfo.value) {
      const currentToday = parseFloat(userInfo.value.today_profit)
      const currentTotal = parseFloat(userInfo.value.total_profit)
      userInfo.value.today_profit = String(currentToday + amount)
      userInfo.value.total_profit = String(currentTotal + amount)
    }
  }

  const fetchUserInfo = async () => {
    // 如果正在加载，等待当前请求完成
    if (isLoadingUserInfo.value && pendingUserInfoRequest) {
      return pendingUserInfoRequest
    }
    
    isLoadingUserInfo.value = true
    pendingUserInfoRequest = (async () => {
      try {
        const { getUserInfo,identifierFS } = await import('@/api/auth');
        if(!localStorage.getItem('hasIdentify')) {
          let params = {
            identifier:siteStore.deviceId || localStorage.getItem('deviceId')
          }
          await identifierFS(params)
        }
        const response = await getUserInfo() as any
        localStorage.setItem('hasIdentify','true')
        // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
        setUserInfo(response)
        return response
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      } finally {
        isLoadingUserInfo.value = false
        pendingUserInfoRequest = null
      }
    })()
    
    return pendingUserInfoRequest
  }

  // 启动时从本地恢复登录态
  const savedToken = localStorage.getItem('token')
  if (savedToken) {
    token.value = savedToken
    isLoggedIn.value = true
    // 后台拉取最新用户信息（静默）
    // fetchUserInfo().catch(() => {
    //   // 拉取失败保留token，稍后可重试
    // })
  }

  return {
    // 状态
    userInfo,
    isLoggedIn,
    token,
    isLoadingUserInfo,
    // 计算属性
    balance,
    todayEarnings,
    totalEarnings,
    levelName,
    inviteCode,
    systemBalance,
    usdtBalance,
    // 方法
    setUserInfo,
    setToken,
    login,
    loginWithMobile,
    register,
    logout,
    updateBalance,
    updateEarnings,
    fetchUserInfo
  }
})
