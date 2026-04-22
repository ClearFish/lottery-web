import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

export function getTime(params?:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/now',
    method: 'get',
    params
  }) as Promise<any>
}
export function getSystemInfo(params?:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/sys-config',
    method: 'get',
    params
  }) as Promise<any>
}
export function getGameConfig(params?:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/configs',
    method: 'get',
    params
  }) as Promise<any>
}
