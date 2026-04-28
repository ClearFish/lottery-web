import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized
} from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";
import { useSystemStore } from "@/store/modules/system";

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    noCache?: boolean;
    keepAlive?: boolean;
  };
}

router.beforeEach((to: toRouteType, from, next) => {
  if(to.query.token){
    localStorage.setItem('token',to.query.token as string)
    localStorage.setItem('game_code',to.query.game_code as string)
    useSystemStore().setGameCode(to.query.game_code as string)
    next({
        path: "/",
    })
    return;
  }
  NProgress.start();
  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  // 页面 title
  setPageTitle(to.meta.title);
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
