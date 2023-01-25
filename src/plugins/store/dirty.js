import { isEqual } from 'lodash'

export default {
  install (components) {
    const { Model } = components

    Object.defineProperty(Model.prototype, '$dirty', {
      get () {
        const original = this.$self().query().where('$id', this.$id).withAllRecursive().first()

        if (!original) {
          return { }
        }

        return Object.keys(original).reduce((accumulator, key) => {
          if (!isEqual(this[key], original[key])) {
            accumulator[key] = this[key]
          }

          return accumulator
        }, { })
      },

      set () { },
    })

    Object.defineProperty(Model.prototype, '$isDirty', {
      get () {
        return Object.keys(this.$dirty).length > 0
      },

      set () { },
    })

    Model.prototype.reset = function () {
      const original = this.$self().query().where('$id', this.$id).withAllRecursive().first()

      if (!original) {
        return
      }

      this.$fill(original)
    }
  },
}
