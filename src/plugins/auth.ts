import { App } from 'vue'
import driverAuthBearer from '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js';
import driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';
import driverOAuth2Google from '@websanova/vue-auth/dist/drivers/oauth2/google.esm.js';
import driverOAuth2Facebook from '@websanova/vue-auth/dist/drivers/oauth2/facebook.esm.js';
import { createAuth } from '@websanova/vue-auth'
import User from '@/models/User';

export default {
  install(app: App) {
    const auth = createAuth({
      plugins: {
        http: app.config.globalProperties.axios,
        router: app.config.globalProperties.$router,
      },
      drivers: {
        http: driverHttpAxios,
        auth: driverAuthBearer,
        router: driverRouterVueRouter,
        oauth2: {
          google: driverOAuth2Google,
          facebook: driverOAuth2Facebook,
        }
      },
      options: {
        loginData: { url: 'auth/login', staySignedIn: false },
        logoutData: { url: 'auth/logout', makeRequest: true },
        fetchData: { url: 'users/@me', method: 'GET', enabled: true },
        refreshData: { url: 'auth/refresh', method: 'POST', interval: 60 },

        notFoundRedirect: { name: 'default' },

        parseUserData: (data: any) => {
          const instance = new User(User.apiService.fromResponse(data))

          User.insert({ data: instance })

          return instance
        },
      }
    })

    app.use(auth)
  },
}
