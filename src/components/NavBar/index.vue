<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { setLocale, $t } from "@/locales";
import { useRouter, useRoute } from "vue-router";
import { useNavBarRight } from "@/composables/useNavBar";

// 定义props
const props = defineProps<{
  customBackHandler?: () => void
}>()

// 定义emits
const emit = defineEmits<{
  back: []
}>()

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
];

const router = useRouter();
const route = useRoute();

const showPopover = ref(false);

// 获取右侧内容
const rightContent = useNavBarRight();

// 获取语言选项
const langOptions = languageOptions.map(lang => ({
  text: lang.label,
  key: lang.value
}));

const onSelectLang = action => {
  setLocale(action.key);
};

const goBack = () => {
  // 如果有自定义返回处理器，使用自定义处理
  if (props.customBackHandler) {
    props.customBackHandler();
  } else {
    // 否则使用默认的router.back()
    router.back();
  }
  
  // 发出back事件
  emit('back');
};

// 客服功能
const handleCustomerService = () => {
  // 直接跳转到客服页面
  router.push('/customer-service')
};

// 从路由中获取标题并翻译
const pageTitle = computed(() => {
  const titleKey = route.meta?.title as string;
  if (titleKey) {
    return $t(titleKey as any);
  }
  return (route.name as string) || '';
});
</script>

<template>
  <van-nav-bar fixed placeholder :title="pageTitle" z-index="99">
    <template #left>
      <van-icon name="arrow-left" @click="goBack" />
    </template>
    <template #right>
      <!-- 动态右侧内容 -->
      <component v-if="rightContent" :is="rightContent" />
      
      <!-- 默认语言切换按钮 -->
      <!-- <van-popover
        v-else
        v-model:show="showPopover"
        :actions="langOptions"
        @select="onSelectLang"
        placement="bottom-end"
      >
        <template #reference>
          <svg-icon class="text-[18px] mr-[12px]" name="lang" />
        </template>
      </van-popover> -->
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
