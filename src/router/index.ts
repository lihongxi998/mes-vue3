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
    meta: { title: '生产管理' }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: () => import('@/views/quality/index.vue'),
    meta: { title: '质量管理' }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('@/views/equipment/index.vue'),
    meta: { title: '设备管理' }
  },
  {
    path: '/material',
    name: 'Material',
    component: () => import('@/views/material/index.vue'),
    meta: { title: '物料管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
