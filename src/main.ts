import '@/design/app.scss'

import { createApp } from 'vue'
import configs from '@/configs'
import router from '@/plugins/router'
import axios from '@/plugins/axios'
import auth from '@/plugins/auth'
import store from '@/plugins/store'
import fa from '@/plugins/fa'
import App from '@/App.vue'

createApp(App)
  .use(router, {
    routes: Object.entries(configs('routes'))
      .reduce((accumulator: any[], [ _, data ]: any) => [ ...accumulator, ...data ], [ ]),
  })
  .use(store)
  .use(axios)
  .use(auth)
  .use(fa)
  .mount('#app')
