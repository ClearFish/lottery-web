// Tabbar高度管理工具

let tabbarHeight = 50 // 默认高度
let isInitialized = false

// 计算并更新Tabbar高度
export const updateTabbarHeight = (): number => {
  const tabbar = document.querySelector('.van-tabbar')
  if (tabbar) {
    const rect = tabbar.getBoundingClientRect()
    tabbarHeight = rect.height
    
    // 设置CSS变量
    document.documentElement.style.setProperty('--van-tabbar-height', `${rect.height}px`)
    
    console.log('Tabbar高度已更新:', rect.height + 'px')
    return rect.height
  }
  
  // 如果找不到tabbar，使用默认高度
  document.documentElement.style.setProperty('--van-tabbar-height', `${tabbarHeight}px`)
  return tabbarHeight
}

// 获取当前Tabbar高度
export const getTabbarHeight = (): number => {
  return tabbarHeight
}

// 初始化Tabbar高度监听
export const initTabbarHeightWatcher = (): void => {
  if (isInitialized) return
  
  // 初始计算
  updateTabbarHeight()
  
  // 监听窗口大小变化
  const handleResize = () => {
    updateTabbarHeight()
  }
  
  // 监听DOM变化（tabbar可能动态显示/隐藏）
  const observer = new MutationObserver(() => {
    updateTabbarHeight()
  })
  
  // 观察body的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  })
  
  window.addEventListener('resize', handleResize)
  
  // 清理函数
  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    observer.disconnect()
  }
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', cleanup)
  
  isInitialized = true
}

// 清理监听器
export const cleanupTabbarHeightWatcher = (): void => {
  // 这里可以添加清理逻辑
  isInitialized = false
}
