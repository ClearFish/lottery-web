import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 游戏接口类型定义
export interface GameItem {
  id: number
  title: string
  icon: string
  cover: string
  bonus: number
  game_type: string
  group_id: string
  hot: number
  collect: boolean
  game_list_id: number
  game_name: string
  game_code: string
  wallet_code: string
  status: number
  status_test: number
}

export interface GameListResponse {
  rows: GameItem[]
  total: number
}

// 游戏分类接口类型
export interface GameCategory {
  title: string
  game_type: string
  icon: string
  remark: string
}

export interface GameCategoryResponse {
  rows: GameCategory[]
}

// 游戏厂商接口类型
export interface GameProvider {
  group_id?: any
  title: string
  icon: string
  game_type?: string,
  types?:any[]
}

export interface GameProviderResponse {
  rows: GameProvider[]
}

// 获取游戏分类
export function getGameCategories(): Promise<GameCategoryResponse> {
  return http.request<GameCategoryResponse>({
    url: '/addons/gameapi/api/category',
    method: 'get'
  })
}

// 获取游戏厂商列表
export function getGameProviders(): Promise<GameProviderResponse> {
  return http.request<GameProviderResponse>({
    url: '/addons/gameapi/api/group',
    method: 'get'
  })
}

// 获取热门游戏
export function getHotGames(params?: { pageIndex?: number; pageSize?: number }): Promise<GameListResponse> {
  return http.request<GameListResponse>({
    url: '/addons/gameapi/api/game',
    method: 'get',
    params: {
      hot: 1,
      pageIndex: 1,
      pageSize: 20,
      ...params
    }
  })
}

// 获取我的收藏游戏
export function getMyFavoriteGames(params?: { pageIndex?: number; pageSize?: number }): Promise<GameListResponse> {
  return http.request<GameListResponse>({
    url: '/addons/gameapi/api/ListCollectGameNew',
    method: 'get',
    params: {
      pageIndex: 1,
      pageSize: 20,
      ...params
    }
  })
}

// 添加收藏游戏
export function addFavoriteGame(data: { game_id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/AddCollectGameNew',
    method: 'post',
    data
  })
}

// 取消收藏游戏
export function removeFavoriteGame(data: { game_id: number }): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/CancelCollectGame',
    method: 'post',
    data
  })
}


// 游戏列表
export function getGameList(params: {
  pageIndex?: number
  pageSize?: number
  group_id?: number
  game_type?: string
  title?: string
  hot?: number
}): Promise<GameListResponse> {
  return http.request<GameListResponse>({
    url: '/addons/gameapi/api/game',
    method: 'get',
    params
  })
}

// 游戏登录接口
export function gameApiLogin(data: {
  game_name: string
  game_code: string
  game_list_id: number
}): Promise<ApiResponse<any>> {
  return http.request<ApiResponse<any>>({
    url: '/addons/gameapi/api/login',
    method: 'post',
    data
  })
}
