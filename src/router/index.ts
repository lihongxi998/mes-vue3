import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '工作台' }
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('@/views/production/index.vue'),
    meta: { title: '生产订单' }
  },
  {
    path: '/scheduling',
    name: 'Scheduling',
    component: () => import('@/views/scheduling/index.vue'),
    meta: { title: '生产排程' }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: () => import('@/views/quality/index.vue'),
    meta: { title: '质量管理' }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/inventory/index.vue'),
    meta: { title: '物料库存' }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('@/views/equipment/index.vue'),
    meta: { title: '设备管理' }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/maintenance/index.vue'),
    meta: { title: '设备维护' }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/feedback/index.vue'),
    meta: { title: '生产报工' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
