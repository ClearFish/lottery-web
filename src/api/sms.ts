import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 发送短信验证码
export function smsSend(data: {
  mobile: string
  event: string
  area_code: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/sms/send',
    method: 'post',
    data
  })
}

// 验证短信验证码
export function smsCheck(data: {
  mobile: string
  event: string
  area_code: string
  captcha: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/sms/check',
    method: 'post',
    data
  })
}

// 验证手机号（用于已绑定手机号的验证）
export function smsVerify(data: {
  captcha: string
  event: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/sms/verify',
    method: 'post',
    data
  })
}

// 获取国家区号列表
export function smsArea(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/sms/area',
    method: 'get'
  })
}

// 绑定手机号
export function bindMobile(data: {
  mobile: string
  area_code: string
  captcha: string
  invite_code?: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/bind-mobile',
    method: 'post',
    data
  })
}

// 获取VIP等级列表
export function getUserLevelList(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/userlevel/api/list',
    method: 'get'
  })
}

// 重置密码
export function resetPassword(data: {
  mobile: string
  area_code: string
  captcha: string
  newpassword: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/resetpwd',
    method: 'post',
    data
  })
}
