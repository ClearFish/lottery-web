import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 客服聊天相关接口

// 获取客服聊天记录
export function getChatHistory(params: { 
  pageIndex: number; 
  pageSize?: number;
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/service/chat/history',
    method: 'get',
    params
  })
}

// 发送消息给客服
export function sendMessage(data: {
  message: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/service/chat/send',
    method: 'post',
    data
  })
}

// 获取客服在线状态和联系方式
export function getServiceStatus(params?: { lang?: string }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/customer/api/service',
    method: 'get',
    params: {
      lang: params?.lang || 'en-us'
    }
  })
}

// 提交工单
export function submitTicket(data: {
  type: 'bug' | 'feature' | 'question' | 'other';
  title: string;
  description: string;
  images?: string[];
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/service/ticket',
    method: 'post',
    data
  })
}

// 获取工单列表
export function getTicketList(params: {
  pageIndex: number;
  pageSize?: number;
  status?: 'pending' | 'processing' | 'resolved' | 'closed';
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/service/tickets',
    method: 'get',
    params
  })
}

// 获取工单详情
export function getTicketDetail(params: { id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: `/api/service/ticket/${params.id}`,
    method: 'get'
  })
}

// 获取IM聊天链接（登录用户）
export function getChatLogin(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/login',
    method: 'post',
    data: {
      game_name: 'Wtalk',
      game_code: '0',
      game_list_id: '5298',
      theme: 'light'
    }
  })
}

// 获取IM聊天链接（游客）
export function getIMGuest(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/im/Guest',
    method: 'get',
    params: {
      theme: 'light'
    }
  })
}

// 获取充值通道列表
export function getEpayList(data?: { currency?: string }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epay/api/missionList',
    method: 'post',
    data
  })
}

// 提交充值
export function epaySubmit(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epay/api/submit',
    method: 'post',
    data
  })
}

// 获取充值记录
export function getEpayRecord(data?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epay/api/record',
    method: 'post',
    data
  })
}

// 修改头像
export function updateAvatar(data: { avatar: string }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/req?game_id=13&method=Avatar',
    method: 'post',
    data
  })
}

// 上传头像文件
export function fileUpload(data: FormData): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/fileUpload',
    method: 'post',
    data
  })
}

// 获取提现信息（银行卡格式等）
export function getBankInfo(params?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epaid/api/format',
    method: 'get',
    params
  })
}

// 绑定银行卡
export function bindBank(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epaid/api/bindbank',
    method: 'post',
    data
  })
}

// 提交提现申请
export function submitWithdraw(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epaid/api/submit',
    method: 'post',
    data
  })
}

// 获取提现记录
export function getWithdrawRecord(data?: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epaid/api/record',
    method: 'post',
    data
  })
}

// 取消提现
export function cancelWithdraw(data: any): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/epaid/api/cancel',
    method: 'post',
    data
  })
}

// 更新FCM Token
export function updateToken(data: { 
  put_token: string; 
  game_id?: number;
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/update_token',
    method: 'post',
    data
  })
}

// 取消任务
export function cancelMission(data: {
  id: number;
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/mission/cancel',
    method: 'post',
    data
  })
}
