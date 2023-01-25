import { reactive } from "vue"

export default {
  install (components) {
    const { Model } = components

    const metaMap = new WeakMap()
    const vmMap = new WeakMap()

    Object.defineProperty(Model, 'meta', {
      get () {
        const model = this.store().$db().model(this.entity)

        if (!vmMap.has(model)) {
          vmMap.set(model, reactive({ }))
        }

        if (!metaMap.has(model)) {
          metaMap.set(model, new Proxy({ }, {
            set (_, key, value) {
              Vue.set(vmMap.get(model), key, value)
    
              return true
            },
    
            get (_, key) {
              return vmMap.get(model)[key]
            },
          }))
        }

        return metaMap.get(model)
      },

      set (value) {
        if (typeof value !== 'object') {
          return
        }
        
        Object.assign(this, value)
      }
    })
  },
}
