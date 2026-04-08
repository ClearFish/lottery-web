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
        component: () => import("@/views/lottery/index.vue"),
        meta: {
          title: "home.title",
          showTabbar: false,
          showNavBar: false
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
