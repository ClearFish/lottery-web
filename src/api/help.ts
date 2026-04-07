import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

// 文章分类接口
export interface ArticleCategory {
  id: number
  title: string
  icon: string
  article_num: number
}

// 文章列表接口
export interface ArticleItem {
  id: number
  title: string
}

// 文章详情接口
export interface ArticleDetail {
  id: number
  title: string
  content: string
}

// 文章分类列表
export function getArticleCategory(): Promise<ArticleCategory[]> {
  return http.request({
    url: '/api/mission/articleCategory',
    method: 'get'
  }) as Promise<ArticleCategory[]>
}

// 文章列表
export function getArticleList(params: {
  pageIndex?: number
  category_id?: number
  hot?: number
}): Promise<ArticleItem[]> {
  return http.request({
    url: '/api/mission/articleList',
    method: 'get',
    params
  }) as Promise<ArticleItem[]>
}

// 文章详情
export function getArticleInfo(params: {
  article_id: number
}): Promise<ArticleDetail> {
  return http.request({
    url: '/api/mission/articleInfo',
    method: 'get',
    params
  }) as Promise<ArticleDetail>
}