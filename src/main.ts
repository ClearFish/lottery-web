import { createApp } from "vue";
import { store } from "./store";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
import "virtual:svg-icons-register";
// i18n
import i18n from "./locales";
// Vant 组件样式
import "vant/es/toast/style";
import "vant/es/dialog/style";
// PWA
import { initPWA } from "./utils/pwa";
import {
  fpjsPlugin,
  FpjsVueOptions,
} from '@fingerprintjs/fingerprintjs-pro-vue-v3';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: 'Q0k5l6rcKHdgjkFYFIzY',
      // region: 'eu',
      // endpoint: ['metrics.yourwebsite.com', defaultEndpoint],
      // scriptUrlPattern: ['metrics.yourwebsite.com/agent-path', defaultScriptUrlPattern],
    },
  } as FpjsVueOptions)

app.mount("#app");

// 初始化PWA
initPWA();
