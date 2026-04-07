<template>
  <van-tabbar v-model="active" :placeholder="true" z-index="999" :route="true" fixed safe-area-inset-bottom>
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon || ''"
      :to="item.to"
      :badge="item.showBadge && unreadCount > 0 ? unreadCount : undefined"
    >
      {{ item.title }}
      <template #icon v-if="!item.icon">
        <img :src="active == index ? DepositActive : Deposit" style="width:22px;height: 22px;"/>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { $t } from "@/locales";
import { useMessageStore } from "@/store/modules/message";
import Deposit from "@/assets/profile/deposit.svg"
import DepositActive from "@/assets/profile/deposit_active.svg"

const active = ref(0);
const { unreadCount } = useMessageStore();

// 使用 computed 保持视图实时更新
const tabbarData = reactive([
  {
    icon: "wap-home-o",
    title: $t('tabbar.home'),
    to: {
      name: "Home"
    },
    showBadge: false
  },
  // {
  //   icon: "chat-o",
  //   title: $t('tabbar.chat'),
  //   to: {
  //     name: "Chat"
  //   },
  //   showBadge: true  // 聊天页面显示未读消息数量
  // },
  {
    icon: "point-gift-o",
    title: $t('home.promotionTitle'),
    to: {
      name: "promotionActivity"
    },
    showBadge: false
  },
  {
    icon: "todo-list-o",
    title: $t('tabbar.tasks'),
    to: {
      name: "Tasks"
    },
    showBadge: false
  },
  {
    icon: "",
    title: $t('profile.deposit'),
    img:Deposit,
    imgActive:DepositActive,
    to: {
      name: "Deposit"
    },
    showBadge: false
  },
  // {
  //   icon: "records-o",
  //   title: $t('tabbar.records'),
  //   to: {
  //     name: "MyTasks"
  //   },
  //   showBadge: false
  // },
  // {
  //   icon: "friends-o",
  //   title: "团队",
  //   to: {
  //     name: "Team"
  //   }
  // },
  {
    icon: "user-o",
    title: $t('tabbar.profile'),
    to: {
      name: "Profile"
    },
    showBadge: false
  }
]);
</script>

<style scoped>
/* 确保PWA安装后安全区域生效 - 使用bottom定位而不是padding */
/* :deep(.van-tabbar) {
  bottom: env(safe-area-inset-bottom);
} */

/* 为PWA模式添加额外的底部安全区域 */
/* :deep(.van-tabbar--fixed) {
  bottom: env(safe-area-inset-bottom);
} */

/* 确保在iOS PWA中正确显示 */
/* @supports (bottom: env(safe-area-inset-bottom)) {
  :deep(.van-tabbar) {
    bottom: max(env(safe-area-inset-bottom), 0px);
  }
} */

/* 备用方案：如果bottom不生效，使用transform */
/* @supports not (bottom: env(safe-area-inset-bottom)) {
  :deep(.van-tabbar) {
    bottom: 0;
    transform: translateY(calc(-1 * env(safe-area-inset-bottom)));
  }
} */
:deep(.van-tabbar) {
  height: 70px;
  box-shadow: 0 0 9px 0 rgba(66, 100, 241, .2);
}
  
</style>
