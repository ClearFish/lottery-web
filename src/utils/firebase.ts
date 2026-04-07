import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { firebaseConfig } from '@/config/firebase';

// 初始化Firebase App
const app = initializeApp(firebaseConfig);

// 懒加载的 messaging 实例
let messagingInstance: Messaging | null = null;
let messagingSupported: boolean | null = null;

// 检查浏览器是否支持 Firebase Messaging
export async function isMessagingSupported(): Promise<boolean> {
  if (messagingSupported !== null) {
    return messagingSupported;
  }
  
  try {
    messagingSupported = await isSupported();
    return messagingSupported;
  } catch (error) {
    console.warn('Firebase Messaging 支持检测失败:', error);
    messagingSupported = false;
    return false;
  }
}

// 获取 Messaging 实例（懒加载）
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messagingInstance) {
    return messagingInstance;
  }
  
  const supported = await isMessagingSupported();
  if (!supported) {
    console.warn('当前浏览器不支持 Firebase Messaging');
    return null;
  }
  
  try {
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.error('初始化 Firebase Messaging 失败:', error);
    return null;
  }
}

// 获取FCM Token
export async function getFCMToken(): Promise<string> {
  const messaging = await getMessagingInstance();
  
  if (!messaging) {
    throw new Error('Firebase Messaging 不支持当前浏览器');
  }
  
  try {
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    });
    return token;
  } catch (error) {
    console.error('获取FCM token失败:', error);
    throw error;
  }
}

// 监听消息
export async function listenToMessages(callback: (payload: any) => void): Promise<void> {
  const messaging = await getMessagingInstance();
  
  if (!messaging) {
    console.warn('Firebase Messaging 不支持，无法监听消息');
    return;
  }
  
  onMessage(messaging, callback);
}

export default app;
