import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Earning {
  id: number
  type: 'task' | 'promotion' | 'bonus'
  amount: number
  description: string
  sourceId?: number
  createdAt: string
}

export interface Withdrawal {
  id: number
  amount: number
  order_number: string
  money: number
  method: 'alipay' | 'wechat' | 'bank'
  account: string
  realName: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  processedAt?: string
  adminNotes?: string
}

export interface TeamMember {
  id: number
  username: string
  phone: string
  avatar: string
  level: number
  joinDate: string
  totalEarnings: number
  status: 'active' | 'inactive'
}

// 团队成员统计信息
export interface TeamMemberStats {
  total_level1_person: number
  total_level2_person: number
  total_level3_person: number
  total_person: number
}

export const useEarningsStore = defineStore('earnings', () => {
  // 状态
  const earnings = ref<Earning[]>([])
  const withdrawals = ref<Withdrawal[]>([])
  const teamMembers = ref<TeamMember[]>([])
  const teamMemberStats = ref<TeamMemberStats>({
    total_level1_person: 0,
    total_level2_person: 0,
    total_level3_person: 0,
    total_person: 0
  })
  const loading = ref(false)

  // 方法
  const fetchEarnings = async (type?: string, startDate?: string, endDate?: string) => {
    loading.value = true
    try {
      // 优先真实接口：任务/团队收益
      try {
        const { getFundsList } = await import('@/api/mission')
        const res = await getFundsList({ pageIndex: 1, type: (type as any) || 'reward' }) as any
        const rows = Array.isArray(res) ? res : (res?.rows || res?.data?.rows || [])
        earnings.value = rows.map((r: any, idx: number) => ({
          id: r.id || idx + 1,
          type: ((type === 'commission') ? 'promotion' : 'task') as 'task' | 'promotion' | 'bonus',
          amount: Number(r.bonus || r.amount || 0),
          description: r.description || '',
          sourceId: r.sourceId,
          createdAt: r.created_at || String(r.ymd_time || new Date().toISOString())
        }))
      } catch (_) {
        // 失败兜底为空数组（不再使用 mock）
        earnings.value = []
      }
    } catch (error) {
      console.error('获取收益记录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchWithdrawals = async () => {
    loading.value = true
    try {
      const { getWithdrawRecord } = await import('@/api/service')
      const res = await getWithdrawRecord({ pageIndex: 1, pageSize: 1000 }) as any
      const rows = Array.isArray(res) ? res : (res?.rows || res?.data?.rows || [])
      withdrawals.value = rows.map((r: any, idx: number) => ({
        id: r.id || idx + 1,
        amount: Number(r.amount || r.bonus || 0),
        money: Number(r.money || 0),
        method: 'bank',
        order_number: r.order_number,
        account: r.card_no || r.account || '',
        realName: r.realname || r.real_name || '',
        status: r.status,
        createdAt: r.created_at || new Date().toISOString(),
        processedAt: r.processed_at
      }))
    } catch (error) {
      console.error('获取提现记录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const submitWithdrawal = async (amount: number, method: string, account: string, realName: string) => {
    try {
      const { submitWithdraw } = await import('@/api/service')
      // game-h5 期望 money 为数值，currency 常用 'SYSTEM'，可根据页面选择
      const data = { money: Number(amount), currency: 'SYSTEM', card_no: account, realname: realName }
      const res = await submitWithdraw(data)
      return res
    } catch (error) {
      console.error('提交提现申请失败:', error)
      throw error
    }
  }

  const fetchTeamMembers = async () => {
    loading.value = true
    try {
      const { getMyMember } = await import('@/api/team')
      const response = await getMyMember()
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      // 更新团队成员统计信息
      teamMemberStats.value = response as TeamMemberStats
    } catch (error) {
      console.error('获取团队成员统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getEarningsSummary = () => {
    const list = Array.isArray(earnings.value) ? earnings.value : []
    const totalEarnings = list.reduce((sum, earning) => sum + earning.amount, 0)
    const taskEarnings = list
      .filter(earning => earning.type === 'task')
      .reduce((sum, earning) => sum + earning.amount, 0)
    const promotionEarnings = list
      .filter(earning => earning.type === 'promotion')
      .reduce((sum, earning) => sum + earning.amount, 0)
    const bonusEarnings = list
      .filter(earning => earning.type === 'bonus')
      .reduce((sum, earning) => sum + earning.amount, 0)

    return {
      totalEarnings,
      todayEarnings: 0, // 今日收益，需要根据实际需求计算
      taskEarnings,
      promotionEarnings,
      bonusEarnings
    }
  }

  // 获取下级团队数据
  const fetchMyTeam = async (params?: { page?: number; limit?: number; level?: number }) => {
    loading.value = true
    try {
      const { getMyTeam } = await import('@/api/team')
      const response = await getMyTeam(params)
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      return response
    } catch (error) {
      console.error('获取下级团队失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取团队统计报表
  const fetchTeamStats = async (params?: { startDate?: string; endDate?: string; level?: number }) => {
    loading.value = true
    try {
      const { getTotalReport } = await import('@/api/team')
      const response = await getTotalReport(params)
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      return response
    } catch (error) {
      console.error('获取团队统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取团队下级人数统计
  const fetchSubordinate = async (params?: { level?: number; startDate?: string; endDate?: string }) => {
    loading.value = true
    try {
      const { getSubordinate } = await import('@/api/team')
      const response = await getSubordinate(params)
      
      // HTTP拦截器已经处理了状态码判断，直接使用返回的数据
      return response
    } catch (error) {
      console.error('获取下级人数统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    earnings,
    withdrawals,
    teamMembers,
    teamMemberStats,
    loading,
    // 方法
    fetchEarnings,
    fetchWithdrawals,
    submitWithdrawal,
    fetchTeamMembers,
    getEarningsSummary,
    fetchMyTeam,
    fetchTeamStats,
    fetchSubordinate
  }
})
