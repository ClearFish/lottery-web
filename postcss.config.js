module.exports = {
  plugins: {
    "postcss-mobile-forever": {
      viewportWidth: 375, // 设计稿宽度
      appSelector: "#app", // 应用根选择器
      maxDisplayWidth: 600, // 最大显示宽度
      // 关键配置：自动矫正fixed定位元素
      appContainingBlock: "auto", // 使用contain: layer自动矫正
      necessarySelectorWhenAuto: "body", // 指定appSelector的父元素
      // 其他优化配置
      unitPrecision: 2, // 转换精度
      minPixelValue: 1, // 最小转换值
      propList: ['*'], // 转换所有属性
      selectorBlackList: ['.ignore', '.hairlines'], // 排除的选择器
      exclude: [/node_modules/], // 排除的文件
      include: [/\.vue$/, /\.css$/, /\.scss$/, /\.less$/], // 包含的文件
      // 关键配置：指定需要矫正的fixed元素选择器
      rootContainingBlockSelectorList: [
        '.van-tabbar--fixed',
        '.van-nav-bar--fixed',
        '.floating-chat-button',
        '.exit-fullscreen',
        '[class*="van-"][class*="fixed"]',
        '[class*="fixed"]',
        '[style*="position: fixed"]'
      ]
    },
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"]
    }
  }
};
