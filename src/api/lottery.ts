import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

export function getTimes(params:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/game-time/'+params.game_code,
    method: 'get',
    params:{}
  }) as Promise<any>
}
export function getGameAgentAlias(params:any): Promise<any[]> {
  return http.request({
    url: '/addons/game/api/getGameAgentAlias',
    method: 'get',
    params
  }) as Promise<any[]>
}
export function getGame(params:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/game-odds/'+params.game_code,
    method: 'get',
    params:{}
  }) as Promise<any[]>
}
export function bet(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/game/api/bet',
    method: 'post',
    data
  })
}
export function getResult(params:any): Promise<any[]> {
  return http.request({
    url: '/addons/game/api/getResult',
    method: 'get',
    params
  }) as Promise<any[]>
}
export function betRecord(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/game/api/betRecord',
    method: 'post',
    data
  })
}
export function resultRecord(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/game/api/resultRecord',
    method: 'post',
    data
  })
}
export function getbetRecordFollow(params:any): Promise<any[]> {
  return http.request({
    url: '/addons/game/api/betRecordFollow',
    method: 'get',
    params
  }) as Promise<any[]>
}
export function getBetRecordNew(params:any): Promise<any[]> {
  return http.request({
    url: '/addons/game/api/betRecordNew',
    method: 'get',
    params
  }) as Promise<any[]>
}
export function periodBetRecord(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/game/api/periodBetRecord',
    method: 'post',
    data
  })
}
export function gameResultsRecord(params:any): Promise<any[]> {
  return http.request({
    url: '/api/game/v1/game-results-record',
    method: 'get',
    params
  }) as Promise<any[]>
}
