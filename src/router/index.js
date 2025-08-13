import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Workspace from '../views/Workspace.vue'
import authService from '../services/authService'

const routes = [
  { path: '/', name: 'Landing', component: Landing, meta: { requiresGuest: true } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/workspace/:id', name: 'Workspace', component: Workspace, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  // Firebase 인증 초기화 대기 (새로고침 직후 보호)
  await authService.waitForInit?.()

  const isAuthenticated = authService.isLoggedIn()

  // 워크스페이스는 공개/비공개에 따라 내부에서 처리하므로 라우터에서는 항상 통과
  if (to.name === 'Workspace') {
    return next()
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', replace: true })
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ path: '/dashboard', replace: true })
  }

  return next()
})

export default router
