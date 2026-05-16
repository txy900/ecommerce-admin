import type { RouteRecordRaw } from "vue-router"
import { createRouter } from "vue-router"
import { routerConfig } from "@/router/config"
import { registerNavigationGuard } from "@/router/guard"
import { flatMultiLevelRoutes } from "./helper"

const Layouts = () => import("@/layouts/index.vue")

// 临时占位组件（所有业务页面暂时指向 Dashboard）
const TempPage = () => import("@/pages/dashboard/index.vue")

/**
 * 常驻路由（基础页面 + 你的电商菜单）
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: { hidden: true },
    children: [
      { path: ":path(.*)", component: () => import("@/pages/redirect/index.vue") }
    ]
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: { hidden: true }
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: { hidden: true },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: { hidden: true }
  },
  // 你的电商菜单
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: TempPage,
        name: "Dashboard",
        meta: { title: "控制台", elIcon: "House", affix: true }
      }
    ]
  },
  {
    path: "/product",
    component: Layouts,
    redirect: "/product/list",
    name: "Product",
    meta: { title: "商品管理", elIcon: "Goods", alwaysShow: true },
    children: [
      { path: "list", component: () => import("@/pages/product/list.vue"), name: "ProductList", meta: { title: "商品列表" } },
      { path: "category", component: () => import("@/pages/product/category.vue"), name: "ProductCategory", meta: { title: "商品分类" } },
      { path: "review", component: () => import("@/pages/product/review.vue"), name: "ProductReview", meta: { title: "商品评价" } },
      {
        path: "inventory",
        // component: TempPage,
        redirect: "/product/inventory/record",
        name: "Inventory",
        meta: { title: "库存管理", alwaysShow: true },
        children: [
          { path: "record", component: () => import("@/pages/product/inventory/record.vue"), name: "InRecord", meta: { title: "入库记录" } }
        ]
      },
      { path: "data", component: () => import("@/pages/product/data.vue"), name: "ProductData", meta: { title: "商品数据" } }
    ]
  },
  {
    path: "/order",
    component: Layouts,
    redirect: "/order/list",
    name: "Order",
    meta: { title: "订单管理", elIcon: "ShoppingCart", alwaysShow: true },
    children: [
      { path: "list", component: () => import("@/pages/order/list.vue"), name: "OrderList", meta: { title: "订单列表" } }
    ]
  },
  {
    path: "/user",
    component: Layouts,
    redirect: "/user/list",
    name: "User",
    meta: { title: "用户管理", elIcon: "User", alwaysShow: true },
    children: [
      { path: "list", component: () => import("@/pages/user/list.vue"), name: "UserList", meta: { title: "用户列表" } }
    ]
  }
]

/**
 * 动态路由（权限相关，暂时为空）
 */
export const dynamicRoutes: RouteRecordRaw[] = []

// 创建路由实例
export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

// 重置路由
export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta?.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    location.reload()
  }
}

// 注册路由导航守卫
registerNavigationGuard(router)
