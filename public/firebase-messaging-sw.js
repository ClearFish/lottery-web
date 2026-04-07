importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase配置
firebase.initializeApp({
  apiKey: "AIzaSyCoXN_8RPt6sPb1HDGStX_6XfBPVS7RqYM",
  authDomain: "com-licwin-pwa.firebaseapp.com",
  projectId: "com-licwin-pwa",
  storageBucket: "com-licwin-pwa.firebasestorage.app",
  messagingSenderId: "485728305739",
  appId: "1:485728305739:web:589dbda79e756776bdc3ce"
});

const messaging = firebase.messaging();

// 处理后台消息
messaging.onBackgroundMessage((payload) => {
  console.log('收到后台消息:', payload);
  
  const notificationTitle = payload.notification?.title || '新消息';
  const notificationOptions = {
    body: payload.notification?.body || '您有新的消息',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 处理通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('通知被点击:', event);
  
  event.notification.close();
  
  // 获取点击后的跳转URL
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 如果已经有打开的窗口，聚焦到该窗口
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// 处理推送事件
self.addEventListener('push', (event) => {
  console.log('收到推送事件:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('推送数据:', data);
      
      // 可以在这里处理推送数据
      if (data.badgeCount && 'setAppBadge' in navigator) {
        navigator.setAppBadge(data.badgeCount).catch(console.error);
      }
    } catch (error) {
      console.error('解析推送数据失败:', error);
    }
  }
});
