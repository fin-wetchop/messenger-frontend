import { App } from 'vue'
import { createStore, Module, ModuleTree } from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMNotify from '@/plugins/store/notify'
import VuexORMDirty from '@/plugins/store/dirty'
import VuexORMMeta from '@/plugins/store/meta'
import VuexORMQuery from '@/plugins/store/query'
import VuexORMAPI from '@/plugins/store/api'
import includer from '@/utils/includer'

export default {
  install(app: App) {
    VuexORM.use(VuexORMNotify)
    VuexORM.use(VuexORMDirty)
    VuexORM.use(VuexORMMeta)
    VuexORM.use(VuexORMQuery)
    VuexORM.use(VuexORMAPI)
    
    const database = new VuexORM.Database()

    includer.context(
      require.context('@/models', true, /^\.\/[^\/]+(?:\/index)?\.(js|ts)$/i),
      model => database.register(model.default),
    )

    const modules: ModuleTree<{}> = {}

    includer.context(
      require.context('@/storages', true, /^\.\/[^\/]+(?:\/index)?\.(js|ts)$/i),
      (module, path) => {
        console.log(path)
        const nodes = path
          .replace(/^\.\//, '')
          .replace(/\.\w+$/, '')
          .replace(/\/+/g, '.')
          .split('.')

        let current: Module<any, {}> = { modules }

        nodes.forEach((node, index) => {
          current.modules![node] = index === nodes.length - 1
            ? {
              namespaced: true,
              ...module,
            }
            : {
              modules: {},
              namespaced: true,
              ...current.modules![node],
            }

          current = current.modules![node] as Module<any, {}>
        })
      },
    )

    const store = createStore({
      state: {},
      mutations: {},
      actions: {},
      modules,
      plugins: [VuexORM.install(database)],
    })

    app.use(store)
  },
}
