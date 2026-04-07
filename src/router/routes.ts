import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // 认证页面（无布局）
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/auth/index.vue"),
    meta: {
      title: "auth.title",
      noCache: true
    }
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/auth/forgot-password.vue"),
    meta: {
      title: "auth.forgotPassword",
      noCache: true
    }
  },
  // 主应用页面（有布局）
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Home" },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "home.title",
          showTabbar: true,
          showNavBar: false
        }
      },
      // {
      //   path: "tasks",
      //   name: "Tasks",
      //   component: () => import("@/views/tasks/index.vue"),
      //   meta: {
      //     title: "tasks.title",
      //     showTabbar: true,
      //     showNavBar: false
      //   }
      // },
      {
        path: "tasks",
        name: "Tasks",
        component: () => import("@/views/task-record/index.vue"),
        meta: {
          title: "tasks.title",
          showTabbar: true,
          showNavBar: false
        }
      },
      {
        path: "tasks/:id",
        name: "TaskDetail",
        component: () => import("@/views/tasks/detail.vue"),
        meta: {
          title: "tasks.taskDetail",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "tasks/:id/submit",
        name: "TaskSubmit",
        component: () => import("@/views/tasks/submit.vue"),
        meta: {
          title: "tasks.submitTask",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: {
          title: "profile.title",
          showTabbar: true,
          showNavBar: false
        }
      },
      {
        path: "profile/withdraw",
        name: "Withdraw",
        component: () => import("@/views/profile/withdraw.vue"),
        meta: {
          title: "withdraw.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/withdraw-records",
        name: "WithdrawRecords",
        component: () => import("@/views/profile/withdraw-records.vue"),
        meta: {
          title: "profile.withdrawRecords",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/deposit",
        name: "Deposit",
        component: () => import("@/views/profile/deposit.vue"),
        meta: {
          title: "deposit.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/deposit-record",
        name: "DepositRcord",
        component: () => import("@/views/profile/deposit-record.vue"),
        meta: {
          title: "deposit.Recordtitle",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/team",
        name: "Team",
        component: () => import("@/views/profile/team.vue"),
        meta: {
          title: "profile.myTeam",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/earnings",
        name: "Earnings",
        component: () => import("@/views/profile/earnings.vue"),
        meta: {
          title: "profile.earningsRecord",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "profile/settings",
        name: "Settings",
        component: () => import("@/views/profile/settings.vue"),
        meta: {
          title: "settings.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "promotion",
        name: "Promotion",
        component: () => import("@/views/promotion/index.vue"),
        meta: {
          title: "promotion.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "help",
        name: "Help",
        component: () => import("@/views/help/index.vue"),
        meta: {
          title: "help.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "help/article/:id",
        name: "ArticleDetail",
        component: () => import("@/views/help/article-detail.vue"),
        meta: {
          title: "help.articleDetail",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "chat",
        name: "Chat",
        component: () => import("@/views/chat/index.vue"),
        meta: {
          title: "chat.title",
          showTabbar: true,
          showNavBar: false,
          keepAlive: true  // 启用页面缓存
        }
      },
      {
        path: "message",
        name: "Message",
        component: () => import("@/views/message/index.vue"),
        meta: {
          title: "message.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "my-tasks",
        name: "MyTasks",
        component: () => import("@/views/my-tasks/index.vue"),
        meta: {
          title: "tasks.title",
          showTabbar: true,
          showNavBar: false
        }
      },
      {
        path: "customer-service",
        name: "CustomerService",
        component: () => import("@/views/customer-service/index.vue"),
        meta: {
          title: "customerService.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "pwa-status",
        name: "PWAStatus",
        component: () => import("@/views/pwa-status/index.vue"),
        meta: {
          title: "pwaStatus.pwaStatus",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "game",
        name: "Game",
        component: () => import("@/views/game/index.vue"),
        meta: {
          title: "game.game",
          showTabbar: false,
          showNavBar: false
        }
      },
      {
        path: "game-hall",
        name: "GameHall",
        component: () => import("@/views/game-hall/index.vue"),
        meta: {
          title: "gameHall.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "vip",
        name: "Vip",
        component: () => import("@/views/vip/index.vue"),
        meta: {
          title: "vip.title",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "promotion-activity",
        name: "promotionActivity",
        component: () => import("@/views/promotion-activity/index.vue"),
        meta: {
          title: "home.promotionTitle",
          showTabbar: true,
          showNavBar: true
        }
      },
      {
        path: "promotion-activity/details",
        name: "promotionActivityDetals",
        component: () => import("@/views/promotion-activity/details.vue"),
        meta: {
          title: "home.promotionDetails",
          showTabbar: true,
          showNavBar: true
        }
      },
      {
        path: "promotion-activity/bettingrewars",
        name: "promotionBttingrewars",
        component: () => import("@/views/promotion-activity/betting-reward.vue"),
        meta: {
          title: "home.promotionBttingrewars",
          showTabbar: false,
          showNavBar: false
        }
      },
      {
        path: "promotion-activity/receiverecords",
        name: "promotionReceiverecords",
        component: () => import("@/views/promotion-activity/receive-record.vue"),
        meta: {
          title: "home.promotionReceiverecords",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "giftcode",
        name: "promotionGiftcode",
        component: () => import("@/views/gift-code/index.vue"),
        meta: {
          title: "home.promotionGiftCode",
          showTabbar: false,
          showNavBar: false
        }
      },
      {
        path: "giftcode/record",
        name: "promotionGiftcodeRecord",
        component: () => import("@/views/gift-code/record.vue"),
        meta: {
          title: "home.promotionGiftCodeReocrd",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "my-team",
        name: "myTeam",
        component: () => import("@/views/my-team/index.vue"),
        meta: {
          title: "home.myTeamTitle",
          showTabbar: true,
          showNavBar: true
        }
      },
      {
        path: "sign-today",
        name: "signToday",
        component: () => import("@/views/sign-today/index.vue"),
        meta: {
          title: "home.signTitle",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "deposit-bonus",
        name: "depositBonous",
        component: () => import("@/views/deposit-bonus/index.vue"),
        meta: {
          title: "home.depositBonous",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "invite",
        name: "Invite",
        component: () => import("@/views/invit/index.vue"),
        meta: {
          title: "home.Invite",
          showTabbar: true,
          showNavBar: false
        }
      },
      {
        path: "inviteinfo-report",
        name: "InviteReport",
        component: () => import("@/views/invit/inviteinfo-report.vue"),
        meta: {
          title: "home.Invite",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "invite-rules",
        name: "InviteRules",
        component: () => import("@/views/invit/rules.vue"),
        meta: {
          title: "home.rules",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "invite-rebate",
        name: "InviteRebate",
        component: () => import("@/views/invit/rebate.vue"),
        meta: {
          title: "home.rebate",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "turnable",
        name: "turnable",
        component: () => import("@/views/turnable/index.vue"),
        meta: {
          title: "home.turnable",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "lotre",
        name: "lotre",
        component: () => import("@/views/lottery/index.vue"),
        meta: {
          title: "home.lotre",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "agent",
        name: "Agent",
        component: () => import("@/views/agent/index.vue"),
        meta: {
          title: "profile.agent",
          showTabbar: false,
          showNavBar: true
        }
      },
      {
        path: "lotre-record",
        name: "lotreRecord",
        component: () => import("@/views/lottery/record.vue"),
        meta: {
          title: "home.lotreRecord",
          showTabbar: false,
          showNavBar: true
        }
      }
    ]
  }
];

export default routes;
