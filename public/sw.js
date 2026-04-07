// Service Worker for PWA
// 构建时间: 2025-10-23T16:11:22.192Z
// 版本: v1761235882192



// 检查是否为API请求
function isApiRequest(url) {
  try {
    const urlObj = new URL(url);
    
    // 检查路径是否包含API相关路径
    if (urlObj.pathname.includes('/api/') || 
        urlObj.pathname.includes('/addons/') ||
        urlObj.pathname.includes('/uploads/')) {
      return true;
    }
    
    // 检查是否包含API相关的查询参数
    if (urlObj.search && (
        urlObj.search.includes('lang=') ||
        urlObj.search.includes('token=') ||
        urlObj.search.includes('timestamp=') ||
        urlObj.search.includes('_t=') ||
        urlObj.search.includes('v='))) {
      return true;
    }
    
    // 检查是否为外部域名（API服务器）
    if (urlObj.hostname !== location.hostname) {
      return true;
    }
    
    // 检查请求头是否包含API相关标识
    if (url.includes('Content-Type: application/json') || 
        url.includes('Content-Type: application/x-www-form-urlencoded')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.log('Error parsing URL:', url, error);
    return false;
  }
}

// 安装事件 - 完全禁用缓存
self.addEventListener('install', (event) => {
  console.log('Service Worker installing... (No caching enabled)');
  // 直接跳过等待，不进行任何缓存操作
  self.skipWaiting();
});

// 激活事件 - 清除所有缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating... (Clearing all caches)');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // 删除所有缓存
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  // 立即控制所有页面
  self.clients.claim();
});

// 完全禁用fetch事件监听器 - 不拦截任何请求
// self.addEventListener('fetch', (event) => {
//   // 完全禁用缓存拦截，让所有请求直接通过浏览器处理
//   // 这样可以确保没有任何缓存行为
// });

// 推送通知事件
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/pwa_logo.png',
    badge: '/pwa_logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/pwa_logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/pwa_logo.png'
      }
    ]
  };

  // 检查通知权限
  if (self.registration.permission === 'granted') {
    event.waitUntil(
      self.registration.showNotification('Full Task i18n', options)
    );
  } else {
    console.log('Notification permission not granted');
  }
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // 关闭通知
    event.notification.close();
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 后台同步事件
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 执行后台同步逻辑
      doBackgroundSync()
    );
  }
});

// 后台同步函数
function doBackgroundSync() {
  return new Promise((resolve) => {
    // 这里可以添加后台同步逻辑
    console.log('Performing background sync...');
    resolve();
  });
}

// 消息事件
self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // 处理测试推送消息
  if (event.data && event.data.type === 'TEST_PUSH') {
    console.log('Test push message received:', event.data);
    
    const options = {
      body: event.data.body || '测试通知',
      icon: event.data.icon || '/pwa_logo.png',
      badge: '/pwa_logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: '查看',
          icon: '/pwa_logo.png'
        },
        {
          action: 'close',
          title: '关闭',
          icon: '/pwa_logo.png'
        }
      ]
    };

    // 检查通知权限
    if (self.registration.permission === 'granted') {
      self.registration.showNotification(event.data.title || '测试通知', options);
    } else {
      console.log('Notification permission not granted');
    }
  }
});
