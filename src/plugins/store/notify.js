export default {
  install (components) {
    const { Model, Actions, RootActions, RootMutations, Query } = components

    Model.notifyUpdate = function () {
      return this.dispatch('notifyUpdate')
    }

    Actions.notifyUpdate = function (context) {
      const state = context.state
      const entity = state.$name

      return context.dispatch(`${state.$connection}/notifyUpdate`, {
          entity,
        }, {
          root: true,
        }
      )
    }

    RootActions.notifyUpdate = function (context, payload) {
      context.commit('notifyUpdate', payload)
    }

    RootMutations.notifyUpdate = function (state, payload) {
      Object.assign(state, state)
    }
  },
}
