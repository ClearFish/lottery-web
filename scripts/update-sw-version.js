#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 生成版本号（基于当前时间戳）
const timestamp = Date.now();
const version = `v${timestamp}`;
const buildTime = new Date().toISOString();

// 更新package.json中的版本号 - 使用有效的语义化版本格式
const major = Math.floor(timestamp / 1000000000000); // 获取时间戳的前几位作为主版本号
const minor = Math.floor((timestamp % 1000000000000) / 1000000); // 中间几位作为次版本号
const patch = timestamp % 1000000; // 最后几位作为修订号
packageJson.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

// 读取 Service Worker 文件
const swPath = path.join(__dirname, '../public/sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// 替换 CACHE_NAME，支持多种格式
swContent = swContent.replace(
  /const CACHE_NAME = 'full-task-i18n-v' \+ Date\.now\(\);?/,
  `const CACHE_NAME = 'full-task-i18n-${version}';`
);

// 如果上面没匹配到，尝试其他格式
if (!swContent.includes(`'full-task-i18n-${version}'`)) {
  swContent = swContent.replace(
    /const CACHE_NAME = '[^']+';?/,
    `const CACHE_NAME = 'full-task-i18n-${version}';`
  );
}

// 添加构建信息注释
const buildInfo = `\n// 构建时间: ${buildTime}\n// 版本: ${version}\n`;
if (!swContent.includes('构建时间:')) {
  swContent = swContent.replace(
    /\/\/ Service Worker for PWA/,
    `// Service Worker for PWA${buildInfo}`
  );
}

// 写回文件
fs.writeFileSync(swPath, swContent);

console.log(`✅ Service Worker 缓存版本已更新: ${version}`);
console.log(`📅 构建时间: ${buildTime}`);
console.log(`📦 Package.json 版本已更新: ${packageJson.version}`);
console.log(`🔢 版本号格式: ${packageJson.version} (基于时间戳: ${timestamp})`);
