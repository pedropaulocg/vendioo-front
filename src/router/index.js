import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { notificarSucesso } from 'src/helper/notification'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
})

router.beforeEach((to, from, next) => {
  const token = JSON.parse(localStorage.getItem('token'))
  if (to.meta.requiresAuth && (!token || token == undefined)) {
    next('/login')
  } else {
    next()
  }
})

export function Logout(erroCode) {
  localStorage.removeItem('username')
  localStorage.removeItem('token')
  router.push('/login')
  if (!erroCode) {
    notificarSucesso('Logout realizado')
  }
}

export default router
