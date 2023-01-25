import { App } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
  install(app: App) {
    axios.defaults.baseURL = "http://127.0.0.1:8000/api/"

    axios.interceptors.request.use(config => {
      config.url = config.url?.replace(/:(\w+)\/?/g, (match, key) => `${config.params[key]}${match.endsWith('/') ? '/' : ''}` ?? '')

      return config
    })

    app.use(VueAxios, axios)

    app.provide('axios', app.config.globalProperties.axios)
  },
}
