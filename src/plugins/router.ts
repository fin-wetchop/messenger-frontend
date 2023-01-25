import { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

interface RouterPluginOptions {
  routes: Array<RouteRecordRaw>
}

export default {
  install (app: App, options: RouterPluginOptions)
  {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: options.routes,
    })

    router.beforeEach((to, from, next) => {
      if (to.meta.logout) {
        app.config.globalProperties.$auth.logout()
      }

      next()
    })

    app.use(router)
  },
}
