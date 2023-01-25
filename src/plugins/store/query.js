import hash from 'object-hash'

export default {
  install (components) {
    const { Model, Query } = components

    const queryMap = new WeakMap()

    Model.setQuery = async function (query, instances) {
      const store = this.store()
      const model = store.$db().model(this.entity)

      if (!queryMap.has(model)) {
        queryMap.set(model, { })
      }

      queryMap.get(model)[hash(query)] = new Set(instances.map(instance => instance.$id))

      await this.notifyUpdate()
    }

    Model.inQuery = function (query) {
      return this.query().inQuery(query).get()
    }

    Query.prototype.inQuery = function (query) {
      const model = this.model

      if (!queryMap.has(model)) {
        return this.where(() => false)
      }

      const set = queryMap.get(model)[hash(query)]
      
      if (!set) {
        return this.where(() => false)
      }

      return this.where(instance => set.has(instance.$id))
    }
  },
}
