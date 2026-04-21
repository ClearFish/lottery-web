import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 用户认证相关API接口
// 基于当前任务平台项目的实际需求

// 注册接口
export function register(data: {
  username: string
  password: string
  mobile?: string
  area_code?: string
  invite_code?: string
  captcha?: string
  code?: string
  newpassword?: string
  groupid?: string
  trid?: string
  identifier?:string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

// 登录接口（支持用户名和手机号登录）
export function login(data: {
  agent_user?: string
  username?: string
  user_id?: string
  currency: string
  sign?: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/game/v1/game-login',
    method: 'post',
    data:data
  })
}

// 获取用户信息
export function getUserInfo(params?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/userInfo',
    method: 'get',
    params
  })
}

// 退出登录
export function logout(params?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/logout',
    method: 'get',
    params
  })
}

// 设置昵称
export function updateNickname(data: { nickname: string }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/im/NickName',
    method: 'post',
    data
  })
}

// 修改登录密码
export function changePassword(data: {
  oldPassword: string
  newPassword: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/changepwd',
    method: 'post',
    data
  })
}

// 修改交易密码
export function reWithdrawalPassword(data: {
  old_password: string
  password: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/reWithdrawalPassword',
    method: 'post',
    data
  })
}

// 设置交易密码
export function setWithdrawalPassword(data: {
  password: string
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/setWithdrawalPassword',
    method: 'post',
    data
  })
}

// 指纹识别
export function identifierFS(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/userlog/api/identifier',
    method: 'post',
    data
  })
}
// 代理申请
export function applyAgent(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/user/applyAgent',
    method: 'post',
    data
  })
}


