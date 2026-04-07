import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

export function signinConfig(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/signin/api/config',
    method: 'get',
    params
  }) as Promise<any>
}
export function signinRecord(data?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/signin/api/record',
    method: 'post',
    data
  })
}
export function signinReceive(data?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/signin/api/receive',
    method: 'post',
    data
  })
}