import { Model } from '@vuex-orm/core'
import { cloneDeep } from 'lodash'
import axios from 'axios'

const methods = {
  async index (query) {
    const data = {
      data: await this.apiService.index(cloneDeep(query)),
    }

    console.log(data)
    
    const collections = await this.insertOrUpdate(data)

    const instances = collections[this.entity] ?? [ ]

    this.setQuery(query ?? { }, instances)

    return instances
  },

  async store (instance) {
    if (!(instance instanceof Model)) {
      instance = new this(instance)
    } else if (!(instance instanceof this)) {
      throw new Error('Store parameter should be object or model instance.')
    }

    const collections = await this.insertOrUpdate({
      data: await this.apiService.store(instance),
    })

    return (collections[this.entity] ?? [ ])[0]
  },

  async show (id) {
    if (id instanceof Model) {
      if (!(id instanceof this)) {
        throw new Error('Show parameter should be id or model instance.')
      }

      id = id.$id()
    }

    const data = await this.apiService.show(id)

    const collections = await this.insertOrUpdate({
      data,
    })

    return (collections[this.entity] ?? [ ])[0]
  },

  async update (instance) {
    if ((!instance instanceof this)) {
      throw new Error('Update parameter should be model instance.') 
    }

    const collections = await this.insertOrUpdate({
      data: await this.apiService.update(instance),
    })

    return (collections[this.entity] ?? [ ])[0]
  },

  async destroy (instance) {
    if (!(instance instanceof this)) {
      if (typeof instance !== 'string' || typeof instance !== 'number') {
        throw new Error('Destroy parameter should be id or model instance.')
      }

      instance = this.find(instance)
    }

    if (!instance) {
      throw new Error('Invalid parameters to destroy')
    }

    await this.apiService.destroy(instance)
    await this.delete(instance.$id)
  },

  async bulkDestroy (ids) {
    if (!Array.isArray(ids)) {
      throw new Error('Bulk destroy paramenter should be array of ids or model instances.')
    }

    ids = ids.map(id => {
      if (id instanceof Model) {
        if (!(id instanceof this)) {
          throw new Error('Bulk destroy paramenter should be array of ids or model instances.')
        }
  
        id = id.$id
      }

      return id
    })

    await this.apiService.bulkDestroy([ ...ids ])
    await this.delete(instance => ids.indexOf(instance.$id) > -1)
  },
}

const handler = {
  apply (target, model, ...args) {
    if (!model.apiService) {
      return
    }

    const name = Object.keys(methods).find(key => methods[key] === target)

    if (!model.apiService[name]) {
      return
    }

    model.apiService.requester = axios
    model.apiService.model = model

    try {
      return target.apply(model, ...args)
    } catch (error) {
      console.log(error)

      throw error
    }
  }
}

export default {
  install (components) {
    const { Model } = components

    Object.defineProperty(Model, 'api', {
      get () {
        if (!this.apiService) {
          return { }
        }

        return Object.fromEntries(
          Object.entries(methods)
            .filter(([ name ]) => !!this.apiService[name])
            .map(([ name, func ]) => [ name, new Proxy(func, handler).bind(this) ])
        )
      },

      set () { },
    })
  },
}
