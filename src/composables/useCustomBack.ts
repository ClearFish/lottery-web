import { inject, type Ref } from 'vue'

// 注入键
const CUSTOM_BACK_HANDLER_KEY = 'customBackHandler'

// 注入自定义返回处理器
export function useCustomBack() {
  const customBackHandler = inject<Ref<(() => void) | null>>(CUSTOM_BACK_HANDLER_KEY)
  
  if (!customBackHandler) {
    throw new Error('useCustomBack must be used within a component that provides customBackHandler')
  }
  
  return {
    setCustomBackHandler: (handler: () => void) => {
      customBackHandler.value = handler
    },
    clearCustomBackHandler: () => {
      customBackHandler.value = null
    }
  }
}
