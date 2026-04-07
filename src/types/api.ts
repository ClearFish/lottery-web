/**
 * API响应基础结构
 * 所有API响应都遵循此结构
 */
export interface ApiResponse<T = any> {
  /** 状态码：1=成功，0=错误 */
  code: number
  /** 响应数据 */
  data: T
  /** 响应消息 */
  msg: string
  /** 时间戳（可选） */
  time?: number
  /** 其他可能的字段 */
  [key: string]: any
}

/**
 * 分页响应数据结构
 */
export interface PageData<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

