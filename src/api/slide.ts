import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 轮播/广告位
export function getAdvertise(params?:any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/slide/api/advertise',
    method: 'get',
    params
  })
}
export function getSite(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/site',
    method: 'get',
  })
}
// 广告
export function activity(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/activity/api/activity',
    method: 'get',
  })
}

