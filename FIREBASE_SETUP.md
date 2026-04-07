# Firebase FCM 配置说明

## 1. 创建Firebase项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 在项目设置中获取配置信息

## 2. 配置Firebase

编辑 `src/config/firebase.ts` 文件，替换以下配置：

```typescript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  vapidKey: "your-actual-vapid-key"
}

export const GAME_ID = 13 // 根据实际项目调整
```

## 3. 获取VAPID密钥

1. 在Firebase Console中，进入项目设置
2. 选择"云消息传递"标签
3. 在"Web推送证书"部分生成或查看VAPID密钥
4. 将VAPID密钥复制到配置文件中

## 4. 配置Service Worker

确保 `public/sw.js` 文件包含FCM消息处理逻辑。

## 5. 测试FCM功能

1. 启动项目：`npm run dev`
2. 访问PWA状态页面
3. 点击"请求通知权限"
4. 点击"更新FCM Token"
5. 检查控制台输出确认Token已更新

## 6. 服务器端配置

确保服务器端API `/addons/gameapi/api/update_token` 能够接收和处理FCM Token更新请求。

## 注意事项

- VAPID密钥是敏感信息，不要提交到版本控制系统
- 确保域名在Firebase Console中已正确配置
- 测试时使用HTTPS协议（FCM要求）
