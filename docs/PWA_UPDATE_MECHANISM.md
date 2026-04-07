# PWA 更新机制说明

## 🔄 自动缓存版本管理

### 问题描述
之前的 PWA 实现中，`CACHE_NAME` 是固定的 `'full-task-i18n-v1.0.0'`，导致每次打包后缓存不会更新，用户无法获取到最新版本。

### 解决方案
实现了基于构建时间戳的动态缓存版本管理：

#### 1. 构建脚本 (`scripts/update-sw-version.js`)
```javascript
// 生成版本号（基于当前时间戳）
const version = `v${Date.now()}`;
const buildTime = new Date().toISOString();

// 替换 CACHE_NAME
swContent = swContent.replace(
  /const CACHE_NAME = 'full-task-i18n-v' \+ Date\.now\(\);?/,
  `const CACHE_NAME = 'full-task-i18n-${version}';`
);
```

#### 2. 构建流程集成
```json
{
  "scripts": {
    "build": "node scripts/update-sw-version.js && run-p type-check build-only"
  }
}
```

### 更新机制流程

#### 1. 构建时更新
```bash
npm run build
# ↓
# 1. 运行 update-sw-version.js
# 2. 生成新的时间戳版本号
# 3. 更新 Service Worker 中的 CACHE_NAME
# 4. 执行 Vite 构建
```

#### 2. Service Worker 更新检测
```javascript
// 在 src/utils/pwa.ts 中
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing
  if (newWorker) {
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        showUpdateDialog() // 显示更新对话框
      }
    })
  }
})
```

#### 3. 用户更新流程
```javascript
// 用户选择更新
navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
window.location.reload() // 刷新页面应用新版本
```

#### 4. 缓存清理
```javascript
// 在 Service Worker 中
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName) // 删除旧缓存
          }
        })
      )
    })
  )
})
```

### 版本号格式

#### 构建前 (开发时)
```javascript
const CACHE_NAME = 'full-task-i18n-v' + Date.now();
```

#### 构建后 (生产时)
```javascript
// 构建时间: 2025-10-23T16:11:22.192Z
// 版本: v1761235882192
const CACHE_NAME = 'full-task-i18n-v1761235882192';
```

### 优势

#### ✅ 自动版本管理
- 每次构建自动生成新的版本号
- 基于时间戳，确保唯一性
- 无需手动维护版本号

#### ✅ 智能更新检测
- 自动检测新版本
- 用户友好的更新提示
- 避免重复提示

#### ✅ 无缝更新体验
- 跳过等待，立即激活
- 自动清理旧缓存
- 页面自动刷新

#### ✅ 离线支持
- 静态资源缓存
- API 请求网络优先
- 离线页面支持

### 使用说明

#### 开发环境
```bash
npm run dev
# Service Worker 使用动态时间戳
```

#### 生产构建
```bash
npm run build
# 自动更新版本号并构建
```

#### 手动更新版本
```bash
node scripts/update-sw-version.js
# 手动更新 Service Worker 版本
```

### 监控和调试

#### 检查当前版本
```javascript
// 在浏览器控制台中
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker 状态:', reg)
})
```

#### 查看缓存版本
```javascript
// 在浏览器控制台中
caches.keys().then(names => {
  console.log('当前缓存版本:', names)
})
```

### 注意事项

1. **版本唯一性**: 基于时间戳确保每次构建都有唯一版本
2. **缓存清理**: 新版本会自动清理旧版本缓存
3. **用户提示**: 避免重复显示更新提示
4. **离线支持**: 保持离线功能正常工作

这个机制确保了 PWA 应用能够正确更新，用户始终使用最新版本！
