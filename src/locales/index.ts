import { createI18n } from "vue-i18n";
import type { TranslateOptions } from "vue-i18n";
import messages from "./locales";
import { getCookie, setCookie } from "@/utils/auth";
import { Locale } from 'vant';
import zhCN from 'vant/es/locale/lang/zh-CN';
import enUS from 'vant/es/locale/lang/en-US';
import viVN from 'vant/es/locale/lang/vi-VN';



const defaultLanguage = import.meta.env.VITE_LOCALE || "yuenan";
// const defaultLanguage = "zh-cn";

// Vant语言映射
const vantLocaleMap: Record<string, string> = {
  'zh-cn': 'zh-CN',
  'en-us': 'en-US', 
  'yuenan': 'vi-VN' // 越南语使用官方越南语包
};

// Vant语言包
const vantMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'vi-VN': viVN
};

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLanguage(),
  fallbackLocale: defaultLanguage, // 当前语言翻译缺失时显示的语言
  messages
});

// 初始化Vant语言
const initialLocale = getDefaultLanguage();
const vantLocale = vantLocaleMap[initialLocale] || 'vi-VN';
const vantMessage = vantMessages[vantLocale as keyof typeof vantMessages];
if (vantMessage) {
  Locale.use(vantLocale, vantMessage);
}

interface T {
  (key: I18nType.I18nKey): string;
  (
    key: I18nType.I18nKey,
    plural: number,
    options?: TranslateOptions<I18nType.LangType>
  ): string;
  (
    key: I18nType.I18nKey,
    defaultMsg: string,
    options?: TranslateOptions<I18nType.I18nKey>
  ): string;
  (
    key: I18nType.I18nKey,
    list: unknown[],
    options?: TranslateOptions<I18nType.I18nKey>
  ): string;
  (key: I18nType.I18nKey, list: unknown[], plural: number): string;
  (key: I18nType.I18nKey, list: unknown[], defaultMsg: string): string;
  (
    key: I18nType.I18nKey,
    named: Record<string, unknown>,
    options?: TranslateOptions<I18nType.LangType>
  ): string;
  (
    key: I18nType.I18nKey,
    named: Record<string, unknown>,
    plural: number
  ): string;
  (
    key: I18nType.I18nKey,
    named: Record<string, unknown>,
    defaultMsg: string
  ): string;
}

export const $t = i18n.global.t as T;
export const $locale = i18n.global.locale;

function getDefaultLanguage(): I18nType.LangType {
  const locales = Object.keys(messages);

  // 1. 优先从 localStorage 中取得语言（iOS兼容性更好）
  const localLanguage = localStorage.getItem("language") as I18nType.LangType | undefined;
  console.log('localLanguage', localLanguage);  
  if (localLanguage && locales.includes(localLanguage)) return localLanguage;

  // 2. 从 Cookie 中取得语言
  const cookieLanguage = getCookie("language");
  console.log('cookieLanguage', cookieLanguage); 
  if (cookieLanguage && locales.includes(cookieLanguage)) return cookieLanguage;


  // 3. 从浏览器中取得默认语言
  // const browserLanguage = navigator.language.toLowerCase() as I18nType.LangType;
  // console.log('browserLanguage', browserLanguage);  
  // if (locales.includes(browserLanguage)) return browserLanguage;
  // console.log('locales', defaultLanguage);  
  // 4. 最后默认语言
  return defaultLanguage;
}

export function setLocale(locale: I18nType.LangType) {
  i18n.global.locale.value = locale;
  
  // 同时存储到 localStorage（主要）和 Cookie（备用）
  localStorage.setItem("language", locale);
  setCookie("language", locale);
  
  // 同步切换Vant语言
  const vantLocale = vantLocaleMap[locale] || 'zh-CN';
  const vantMessage = vantMessages[vantLocale as keyof typeof vantMessages];
  
  if (vantMessage) {
    Locale.use(vantLocale, vantMessage);
  }
}

export default i18n;
