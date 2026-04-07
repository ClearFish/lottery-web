<script setup lang="ts">
import tabbar from "@/components/Tabbar/index.vue";
import NavBar from "@/components/NavBar/index.vue";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import { computed, ref, provide, inject,watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { provideNavBarRight, createNavBarRight } from "@/composables/useNavBar";
import { useSiteStore } from "@/store/modules/site";

const siteStore = useSiteStore()
// 导航栏自定义返回处理器
const customBackHandler = ref<(() => void) | null>(null)
// 提供自定义返回处理器
provide('customBackHandler', customBackHandler)

const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});

const route = useRoute();

const showNavBar = computed(() => {
  return route.meta.showNavBar === true;
});

const showTabbar = computed(() => {
  return route.meta.showTabbar === true;
});

// 创建并提供导航栏右侧内容
const navBarRight = createNavBarRight();
provideNavBarRight(navBarRight);



</script>

<template>
  <div class="app-wrapper">
    <van-config-provider :theme="'light'">
      <nav-bar v-if="showNavBar" :custom-back-handler="customBackHandler" />
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <tabbar v-if="showTabbar" />
    </van-config-provider>
  </div>
</template>

<style lang="less" scoped>
@import "@/styles/mixin.less";

.app-wrapper {
  .clearfix();
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: scroll;
}
</style>
