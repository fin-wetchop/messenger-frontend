import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    name: 'default',
    meta: { auth: true },
    component: () => import('@/views/chats/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { auth: false },
    component: () => import('@/views/auth/login.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { auth: true, logout: true },
  },
  {
    path: '/register',
    name: 'register',
    meta: { auth: false },
    component: () => import('@/views/auth/register.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/utility/404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '404',
  },
] as RouteRecordRaw[]
