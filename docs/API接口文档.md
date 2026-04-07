# API接口文档

## 基础信息

### 请求格式
- **Base URL**: `https://api.taskplatform.com`
- **Content-Type**: `application/json`
- **认证方式**: JWT Bearer Token

### 响应格式
```typescript
// 统一响应格式
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页响应格式
interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
```

## 认证模块

### 用户注册
```http
POST /api/auth/register
```

**请求参数**:
```typescript
interface RegisterRequest {
  phone: string          // 手机号
  password: string       // 密码
  inviteCode?: string    // 邀请码（可选）
  smsCode: string        // 短信验证码
}
```

**响应数据**:
```typescript
interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
    phone: string
    balance: number
    inviteCode: string
  }
}
```

### 用户登录
```http
POST /api/auth/login
```

**请求参数**:
```typescript
interface LoginRequest {
  phone: string      // 手机号
  password: string   // 密码
}
```

**响应数据**:
```typescript
interface LoginResponse {
  token: string
  user: UserProfile
}
```

### 获取用户信息
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**响应数据**:
```typescript
interface UserProfile {
  id: number
  username: string
  phone: string
  balance: number
  inviteCode: string
  teamCount: number
  totalEarnings: number
  todayEarnings: number
}
```

### 发送短信验证码
```http
POST /api/auth/send-sms
```

**请求参数**:
```typescript
interface SendSmsRequest {
  phone: string
  type: 'register' | 'login' | 'reset'
}
```

## 任务模块

### 获取任务列表
```http
GET /api/tasks
```

**查询参数**:
```typescript
interface TaskListQuery {
  category?: 'douyin' | 'kuaishou' | 'sms' | 'xiaohongshu' | 'toutiao'
  status?: 'active' | 'inactive'
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface TaskListResponse {
  list: Task[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

interface Task {
  id: number
  name: string
  category: string
  reward: number
  remainingCount: number
  totalCount: number
  keywords: string[]
  description: string
  status: 'active' | 'inactive'
  createdAt: string
}
```

### 获取任务详情
```http
GET /api/tasks/:id
```

**响应数据**:
```typescript
interface TaskDetail {
  id: number
  name: string
  category: string
  reward: number
  remainingCount: number
  totalCount: number
  keywords: string[]
  description: string
  requirements: string
  materials: {
    videos: string[]
    images: string[]
  }
  status: 'active' | 'inactive'
  createdAt: string
}
```

### 领取任务
```http
POST /api/tasks/:id/claim
Authorization: Bearer <token>
```

**响应数据**:
```typescript
interface ClaimTaskResponse {
  success: boolean
  message: string
  userTaskId: number
}
```

### 提交任务
```http
POST /api/tasks/:id/submit
Authorization: Bearer <token>
```

**请求参数**:
```typescript
interface SubmitTaskRequest {
  submissionData: {
    screenshots: string[]    // 截图
    description: string      // 提交说明
    links?: string[]         // 相关链接
  }
}
```

**响应数据**:
```typescript
interface SubmitTaskResponse {
  success: boolean
  message: string
  reward: number
}
```

### 获取我的任务
```http
GET /api/user/tasks
Authorization: Bearer <token>
```

**查询参数**:
```typescript
interface MyTasksQuery {
  status?: 'pending' | 'in_progress' | 'completed' | 'abandoned'
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface MyTasksResponse {
  list: UserTask[]
  total: number
  page: number
  limit: number
}

interface UserTask {
  id: number
  taskId: number
  taskName: string
  category: string
  reward: number
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned'
  claimedAt: string
  completedAt?: string
  submissionData?: any
}
```

## 个人中心模块

### 获取收益统计
```http
GET /api/user/earnings
Authorization: Bearer <token>
```

**查询参数**:
```typescript
interface EarningsQuery {
  type?: 'task' | 'promotion' | 'bonus'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface EarningsResponse {
  list: Earning[]
  total: number
  summary: {
    totalEarnings: number
    taskEarnings: number
    promotionEarnings: number
    bonusEarnings: number
  }
}

interface Earning {
  id: number
  type: 'task' | 'promotion' | 'bonus'
  amount: number
  description: string
  sourceId?: number
  createdAt: string
}
```

### 申请提现
```http
POST /api/user/withdraw
Authorization: Bearer <token>
```

**请求参数**:
```typescript
interface WithdrawRequest {
  amount: number
  method: 'alipay' | 'wechat' | 'bank'
  account: string
  realName: string
}
```

**响应数据**:
```typescript
interface WithdrawResponse {
  success: boolean
  message: string
  withdrawalId: number
}
```

### 获取提现记录
```http
GET /api/user/withdrawals
Authorization: Bearer <token>
```

**查询参数**:
```typescript
interface WithdrawalsQuery {
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface WithdrawalsResponse {
  list: Withdrawal[]
  total: number
}

interface Withdrawal {
  id: number
  amount: number
  method: string
  account: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  processedAt?: string
  adminNotes?: string
}
```

## 推广模块

### 获取推广信息
```http
GET /api/promotion/info
Authorization: Bearer <token>
```

**响应数据**:
```typescript
interface PromotionInfo {
  inviteCode: string
  inviteUrl: string
  qrCode: string
  posterUrl: string
  teamStats: {
    totalMembers: number
    level1Members: number
    level2Members: number
    level3Members: number
    totalEarnings: number
  }
}
```

### 获取团队列表
```http
GET /api/promotion/team
Authorization: Bearer <token>
```

**查询参数**:
```typescript
interface TeamQuery {
  level?: 1 | 2 | 3
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface TeamResponse {
  list: TeamMember[]
  total: number
  summary: {
    level1Count: number
    level2Count: number
    level3Count: number
    totalEarnings: number
  }
}

interface TeamMember {
  id: number
  username: string
  phone: string
  level: number
  joinDate: string
  totalEarnings: number
  status: 'active' | 'inactive'
}
```

### 生成推广海报
```http
POST /api/promotion/generate-poster
Authorization: Bearer <token>
```

**请求参数**:
```typescript
interface GeneratePosterRequest {
  template: string    // 模板ID
  customText?: string // 自定义文字
}
```

**响应数据**:
```typescript
interface GeneratePosterResponse {
  posterUrl: string
  qrCode: string
  inviteUrl: string
}
```

## 客服模块

### 获取帮助文档
```http
GET /api/help/articles
```

**查询参数**:
```typescript
interface HelpQuery {
  category?: string
  keyword?: string
  page?: number
  limit?: number
}
```

**响应数据**:
```typescript
interface HelpResponse {
  list: HelpArticle[]
  total: number
}

interface HelpArticle {
  id: number
  title: string
  content: string
  category: string
  views: number
  createdAt: string
}
```

### 提交工单
```http
POST /api/support/ticket
Authorization: Bearer <token>
```

**请求参数**:
```typescript
interface CreateTicketRequest {
  type: 'bug' | 'feature' | 'question' | 'other'
  title: string
  description: string
  images?: string[]
}
```

**响应数据**:
```typescript
interface CreateTicketResponse {
  success: boolean
  message: string
  ticketId: number
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 参数验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 接口限流

- **登录接口**: 5次/分钟
- **注册接口**: 3次/分钟
- **短信接口**: 1次/分钟
- **其他接口**: 100次/分钟

## 注意事项

1. 所有时间格式使用 ISO 8601 标准
2. 金额字段使用分为单位，前端需要转换显示
3. 文件上传需要先获取上传凭证
4. 敏感操作需要二次验证
5. 接口版本控制使用 URL 路径版本号
