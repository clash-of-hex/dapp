import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
const isProduction = process.env.NODE_ENV == 'production';

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Main",
    component: () => import("@/view/MainPage.vue"),
  },
  {
    path: "/how-it-work",
    name: "HowItWork",
    component: () => import("@/view/HowItWorkPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(isProduction ? '/v2/' : '/'),
  routes,
});
router.beforeEach(() => {
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
