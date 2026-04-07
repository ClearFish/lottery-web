import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 任务分类列表
export function getMissionCategoryList(params?: {
  pageIndex?: number
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/categoryList',
    method: 'get',
    params
  })
}

// 任务列表
export function getMissionList(params: {
  pageIndex: number
  cid: number
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/list',
    method: 'get',
    params
  })
}

// 已领取任务列表
export function getReceiveList(params: {
  pageIndex: number
  status: 0 | 1
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/receiveList',
    method: 'get',
    params
  })
}

// 任务收益/团队收益列表
export function getFundsList(params: {
  pageIndex: number
  type: 'reward' | 'commission'
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/fundsList',
    method: 'get',
    params
  })
}

// 我的团队列表
export function getTeamList(params: {
  pageIndex: number
  level: 1 | 2 | 3
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/getTeamUserList',
    method: 'get',
    params
  })
}

// 领取任务
export function receiveMission(data: { id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/receive',
    method: 'post',
    data
  })
}

// 任务详情
export function getMissionInfo(params: { id: number,receive_id?: number,type?: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/info',
    method: 'get',
    params
  })
}

// 提交任务（表单上传）
export function submitMission(data: { id: number; file?: File; video_url?: string }): Promise<ApiResponse<any>> {
  const form = new FormData()
  
  form.append('id', String(data.id))
  if (data.file) form.append('file', data.file)
  if (data.video_url) form.append('video_url', data.video_url)

  return http.request<ApiResponse<any>>({
    url: '/api/mission/submit',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: form
  })
}


