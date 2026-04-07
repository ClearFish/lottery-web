import { ref, provide, inject, type Ref, type Component } from 'vue'

// 导航栏右侧内容类型
export type NavBarRightContent = Component | string | null

// 注入键
const NAV_BAR_RIGHT_KEY = Symbol('navBarRight')

// 提供右侧内容
export function provideNavBarRight(content: Ref<NavBarRightContent>) {
  provide(NAV_BAR_RIGHT_KEY, content)
}

// 注入右侧内容
export function useNavBarRight() {
  const content = inject<Ref<NavBarRightContent>>(NAV_BAR_RIGHT_KEY)
  return content || ref(null)
}

// 创建右侧内容
export function createNavBarRight(initialContent: NavBarRightContent = null) {
  return ref<NavBarRightContent>(initialContent)
}
