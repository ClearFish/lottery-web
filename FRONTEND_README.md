# 任务分发平台 - 前端项目

## 项目概述

这是一个基于Vue 3 + TypeScript + Vite的任务分发平台前端项目，支持用户注册登录、任务管理、收益统计、推广分享等功能。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集，提供类型安全
- **Vite** - 快速构建工具
- **Vant 4** - 移动端UI组件库
- **Pinia** - Vue 3状态管理库
- **Vue Router** - 官方路由管理器
- **Tailwind CSS** - 原子化CSS框架
- **Less** - CSS预处理器

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── TaskCard/       # 任务卡片组件
│   ├── UserCard/       # 用户卡片组件
│   ├── EarningsChart/ # 收益图表组件
│   ├── NavBar/         # 导航栏组件
│   ├── Tabbar/         # 底部导航组件
│   └── SvgIcon/        # SVG图标组件
├── views/              # 页面组件
│   ├── auth/           # 认证页面
│   │   ├── login.vue   # 登录页
│   │   └── register.vue # 注册页
│   ├── home/           # 首页
│   ├── tasks/          # 任务相关页面
│   ├── profile/        # 个人中心页面
│   ├── promotion/      # 推广页面
│   ├── help/           # 帮助页面
│   └── message/        # 消息页面
├── store/              # 状态管理
│   └── modules/        # 按模块划分的store
├── api/                # API接口
│   └── mock/           # Mock数据
├── router/             # 路由配置
├── utils/              # 工具函数
├── hooks/              # 组合式函数
├── types/              # TypeScript类型定义
└── styles/             # 样式文件
```

## 功能模块

### 1. 用户认证
- 用户注册（手机号 + 短信验证码）
- 用户登录（密码登录 / 短信验证码登录）
- 用户信息管理

### 2. 任务系统
- 任务分类（抖音、快手、短信、小红书、头条）
- 任务列表和详情
- 任务领取和提交
- 任务状态管理

### 3. 收益管理
- 收益统计和记录
- 提现申请和管理
- 提现记录查询

### 4. 推广系统
- 三级分销体系
- 推广海报生成
- 邀请码管理
- 团队统计

### 5. 个人中心
- 个人信息展示
- 功能菜单导航
- 设置和帮助

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用pnpm
pnpm install

# 或使用npm
npm install
```

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

### 构建生产版本
```bash
# 构建生产版本
pnpm build

# 或
npm run build
```

### 预览生产版本
```bash
# 预览构建结果
pnpm preview

# 或
npm run preview
```

## 页面路由

### 认证页面
- `/auth/login` - 登录页
- `/auth/register` - 注册页

### 主应用页面
- `/home` - 首页
- `/tasks` - 任务中心
- `/tasks/:id` - 任务详情
- `/tasks/:id/submit` - 任务提交
- `/profile` - 个人中心
- `/profile/withdraw` - 提现页
- `/profile/withdraw-records` - 提现记录
- `/profile/team` - 我的团队
- `/promotion` - 推广分享
- `/help` - 帮助手册
- `/message` - 消息通知

## 状态管理

### 用户状态 (useUserStore)
- `userInfo` - 用户信息
- `isLoggedIn` - 登录状态
- `balance` - 账户余额
- `login()` - 登录方法
- `register()` - 注册方法
- `logout()` - 退出登录

### 任务状态 (useTaskStore)
- `taskList` - 任务列表
- `myTasks` - 我的任务
- `currentTask` - 当前任务
- `fetchTaskList()` - 获取任务列表
- `claimTask()` - 领取任务
- `submitTask()` - 提交任务

### 收益状态 (useEarningsStore)
- `earnings` - 收益记录
- `withdrawals` - 提现记录
- `teamMembers` - 团队成员
- `fetchEarnings()` - 获取收益记录
- `submitWithdrawal()` - 提交提现申请

## 组件说明

### 基础组件
- **TaskCard** - 任务卡片，显示任务信息和操作按钮
- **UserCard** - 用户信息卡片，显示用户头像和收益信息
- **EarningsChart** - 收益图表，展示收益趋势
- **NavBar** - 顶部导航栏
- **Tabbar** - 底部导航栏

### 页面组件
- **Home** - 首页，包含Banner、推荐游戏、任务分类、收益概览
- **Login/Register** - 登录注册页面
- **Tasks** - 任务中心，任务列表和筛选
- **TaskDetail** - 任务详情，任务信息和素材
- **TaskSubmit** - 任务提交，提交表单
- **Profile** - 个人中心，用户信息和功能菜单
- **Withdraw** - 提现页面，提现申请表单
- **Earnings** - 收益记录，收益统计和明细
- **Team** - 我的团队，团队成员和统计
- **Promotion** - 推广分享，推广海报和链接
- **Help** - 帮助手册，常见问题和客服
- **Message** - 消息通知，系统消息管理

## Mock数据

项目使用Mock数据模拟后端API，所有数据都在 `src/api/mock/index.ts` 中定义。

### Mock API接口
- `login()` - 用户登录
- `register()` - 用户注册
- `getTasks()` - 获取任务列表
- `claimTask()` - 领取任务
- `submitTask()` - 提交任务
- `getEarnings()` - 获取收益记录
- `submitWithdrawal()` - 提交提现申请
- `getWithdrawals()` - 获取提现记录
- `getTeamMembers()` - 获取团队成员

## 样式规范

### 设计系统
- **主色调**: #1890ff (蓝色)
- **成功色**: #52c41a (绿色)
- **警告色**: #fa8c16 (橙色)
- **错误色**: #ff4d4f (红色)
- **字体**: 系统默认字体
- **圆角**: 8px (卡片), 12px (按钮)

### 响应式设计
- 移动端优先设计
- 支持320px-768px屏幕
- 使用Vant组件库确保移动端体验

## 开发注意事项

1. **类型安全**: 所有组件都使用TypeScript，确保类型安全
2. **组件复用**: 公共组件设计为可复用，通过props传递数据
3. **状态管理**: 使用Pinia进行状态管理，按模块划分
4. **路由守卫**: 需要登录的页面添加路由守卫
5. **错误处理**: 所有API调用都包含错误处理
6. **加载状态**: 异步操作显示加载状态
7. **用户体验**: 操作反馈及时，错误提示友好

## 后续开发

1. **真实API集成**: 替换Mock数据为真实API调用
2. **图表组件**: 集成ECharts等图表库
3. **图片上传**: 实现文件上传功能
4. **推送通知**: 集成消息推送服务
5. **性能优化**: 代码分割、懒加载等优化
6. **测试**: 添加单元测试和E2E测试
7. **PWA**: 支持离线使用和安装

## 部署说明

### 构建配置
- 使用Vite进行构建
- 支持CDN资源优化
- 自动代码分割
- 资源压缩和优化

### 环境变量
```env
VITE_API_BASE_URL=https://api.taskplatform.com
VITE_APP_TITLE=任务分发平台
```

### 部署命令
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 联系方式

如有问题或建议，请联系开发团队。
