import { pageDefaultTitle } from "@/settings";
import { $t } from "@/locales";

export default function setPageTitle(routerTitle?: string): void {
  // window.document.title = routerTitle
  //   ? `${routerTitle} | ${pageDefaultTitle}`
  //   : `${pageDefaultTitle}`;
  
  if (routerTitle) {
    // 如果routerTitle是多语言key，则进行翻译
    try {
      const translatedTitle = $t(routerTitle as any);
      window.document.title = translatedTitle;
    } catch (error) {
      // 如果翻译失败，直接使用原始值
      window.document.title = routerTitle;
    }
  } else {
    window.document.title = pageDefaultTitle;
  }
}
