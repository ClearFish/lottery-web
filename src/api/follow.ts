import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 跟投活动列表
export function getFollowList(params?: {
  pageIndex?: number
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/follow/list',
    method: 'get',
    params
  })
}

// 任务领取记录
export function getFollowReceiveList(params?: {
  pageIndex?: number
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/follow/receiveList',
    method: 'get',
    params
  })
}

// 领取跟投活动
export function receiveFollow(data: { id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/follow/receive',
    method: 'post',
    data
  })
}

