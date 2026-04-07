import http from '@/utils/http'

// 团队相关API接口
// 基于当前任务平台项目的实际需求

// 获取下级会员数据
export function getMyMember(params?: {
  page?: number
  limit?: number
  level?: number
  status?: string
}) {
  return http.request({
    url: '/api/user/getMyMember',
    method: 'post',
    data: params
  })
}

// 获取下级团队数据
export function getMyTeam(data?: {
  page?: number
  limit?: number
  level?: number
}) {
  return http.request({
    url: '/addons/game/api/getMyTeam',
    method: 'post',
    data
  })
}

// 获取团队下级人数统计
export function getSubordinate(params?: {
  level?: number
  startDate?: string
  endDate?: string
}) {
  return http.request({
    url: '/addons/game/api/myTeamSubordinate',
    method: 'get',
    params
  })
}

// 获取团队统计报表
export function getTotalReport(params?: {
  startDate?: string
  endDate?: string
  level?: number
}) {
  return http.request({
    url: '/addons/game/api/getTotalReport',
    method: 'get',
    params
  })
}
