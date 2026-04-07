import http from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 钱包相关API接口

// 钱包信息接口响应类型
export interface WalletInfo {
  money: string
  [key: string]: any
}

// 获取钱包余额
export function getWalletBalance(lang: string = 'yuenan'): Promise<WalletInfo> {
  return http.request<WalletInfo>({
    url: '/addons/gameapi/api/wallet',
    method: 'get',
    params: {
      lang
    }
  })
}

// 获取钱包详情
export function getWalletDetails(): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/wallet/details',
    method: 'get'
  })
}

// 更新钱包余额
export function updateWalletBalance(amount: number): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/api/wallet/update',
    method: 'post',
    data: {
      amount
    }
  })
}
