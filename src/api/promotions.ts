import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

export function activity(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/activity/api/activity',
    method: 'get',
    params
  }) as Promise<any>
}
export function invite_balance(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/activity/api/balance',
    method: 'get',
    params
  }) as Promise<any>
}
export function assignmobileList(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/assignmobile/api/list',
    method: 'get',
    params
  }) as Promise<any>
}
export function getActivity(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/activity/api/getActivity',
    method: 'get',
    params
  }) as Promise<any>
}
export function gameApiLogin(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/login',
    method: 'post',
    data
  })
}
export function redenvelope(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/redenvelope/api/receivet',
    method: 'get',
    params
  }) as Promise<any>
}
export function redenvelopeRecord(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/redenvelope/api/record',
    method: 'get',
    params
  }) as Promise<any>
}
export function promotionsList(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/promotions/api/list',
    method: 'get',
    params
  }) as Promise<any>
}
export function promotionsReceive(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/promotions/api/receive',
    method: 'post',
    data
  })
}
export function promotionsRecord(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/promotions/api/record',
    method: 'get',
    params
  }) as Promise<any>
}
export function promotionsGroup(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/promotions/api/group',
    method: 'get',
    params
  }) as Promise<any>
}
export function rebateInfo(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/rebate/api/info',
    method: 'get',
    params
  }) as Promise<any>
}
export function getShare(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/invite/api/getShare',
    method: 'get',
    params
  }) as Promise<any>
}
export function Report(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/invite/api/Report',
    method: 'get',
    params
  }) as Promise<any>
}
export function rebateConfig(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/rebate/api/config',
    method: 'get',
    params
  }) as Promise<any>
}
export function getLevel(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/rebate/api/level',
    method: 'get',
    params
  }) as Promise<any>
}
export function Subordinate(params?:any): Promise<any[]> {
  return http.request({
    url: '/addons/game/api/myTeamSubordinate',
    method: 'get',
    params
  }) as Promise<any>
}
export function addMsgUser(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/req?game_id=13&method=AddContact',
    method: 'post',
    data
  })
}