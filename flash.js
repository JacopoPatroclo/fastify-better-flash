const utils = require('./utils')

module.exports = function () {
  return {
    /**
    * @name flash
    * @description Set a flash message
    * @param {string} scope
    * @param {any} value
    */
    setter (scope, value) {
      if (!this.session) {
        throw new Error('Session not found, make sure to register @fastify/secure-session')
      }

      if (typeof scope !== 'string') {
        throw new Error('Expected scope to be a string')
      }

      // in this way we are a drop in replacement for @fastify/flash
      let currentSession = this.session.get('flash')
      if (!currentSession) {
        currentSession = {}
      }

      utils.attachThingToObjectGivenPath(scope, currentSession, value)

      this.session.set('flash', currentSession)
    },
    getter (scope) {
      if (!this.request.session) {
        throw new Error('Session not found, make sure to register @fastify/secure-session')
      }

      if (typeof scope !== 'string') {
        throw new Error('Expected scope to be a string')
      }

      const currentSession = this.request.session.get('flash')
      if (!currentSession) {
        return undefined
      }

      const output = utils.retriveThingFromObjectGivenPath(scope, currentSession)
      utils.deleteThingFromObjectGivenPath(scope, currentSession)

      this.request.session.set('flash', currentSession)
      return output
    }
  }
}
