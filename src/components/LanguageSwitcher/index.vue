<template>
  <div class="language-switcher">
    <van-cell-group inset>
      <van-cell 
        :title="$t('language.title')" 
        is-link 
        @click="showLanguagePicker"
      >
        <template #icon>
          <svg-icon class="text-[18px] mr-[12px]" style="color: #3b82f6" name="lang" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 语言选择弹窗 -->
    <van-popup 
      v-model:show="showPicker" 
      position="bottom" 
      :style="{ height: '50%' }"
    >
      <div class="language-picker">
        <div class="picker-header">
          <h3>{{ $t('language.selectLanguage') }}</h3>
          <van-icon name="cross" @click="showPicker = false" />
        </div>
        
        <div class="language-list">
          <div 
            v-for="lang in languageOptions" 
            :key="lang.value"
            class="language-item"
            :class="{ active: currentLanguage === lang.value }"
            @click="selectLanguage(lang.value)"
          >
            <div class="language-info">
              <div class="language-name">{{ lang.label }}</div>
              <div class="language-native">{{ lang.native }}</div>
            </div>
            <van-icon 
              v-if="currentLanguage === lang.value" 
              name="success" 
              color="#1890ff" 
            />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { $t, $locale, setLocale } from '@/locales'
import { switchLanguageAndReload } from '@/utils/cache-cleaner'
import SvgIcon from '@/components/SvgIcon/index.vue'

const showPicker = ref(false)

// 语言选项
const languageOptions = [
  {
    value: 'zh-cn',
    label: $t('language.chinese'),
    native: '中文'
  },
  {
    value: 'en-us', 
    label: $t('language.english'),
    native: 'English'
  },
  {
    value: 'yuenan',
    label: $t('language.vietnamese'),
    native: 'Tiếng Việt'
  }
]

// 当前语言
const currentLanguage = computed(() => $locale.value)

// 显示语言选择器
const showLanguagePicker = () => {
  showPicker.value = true
}

// 选择语言
const selectLanguage = async (lang: string) => {
  if (lang === currentLanguage.value) {
    showPicker.value = false
    return
  }
  
  setLocale(lang as any)
  showToast($t('language.languageChanged'))
  showPicker.value = false
  
  // 使用专门的缓存清理和刷新工具
  await switchLanguageAndReload()
}
</script>

<style scoped>
.language-switcher {
  margin: 16px 0;
}

.language-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.picker-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.picker-header .van-icon {
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.language-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.language-item:hover {
  background: #f5f5f5;
}

.language-item.active {
  background: #e6f7ff;
}

.language-info {
  flex: 1;
}

.language-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.language-native {
  font-size: 14px;
  color: #666;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
  font-size: 16px;
}

:deep(.van-cell__left-icon) {
  margin-right: 12px;
  color: #3b82f6;
}
</style>