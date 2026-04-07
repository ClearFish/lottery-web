import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 通知列表
export function getMsgHistory(params: { pageIndex: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/usermsg/api/history',
    method: 'get',
    params
  })
}

// 通知状态更新（标记已读）
export function getUserMsg(params: { id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/usermsg/api/getUserMsg',
    method: 'get',
    params
  })
}


