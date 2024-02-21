'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, done) {
  const flash = require('./flash')()
  fastify.decorateRequest('flash', flash.setter)
  fastify.decorateReply('flash', flash.getter)
  done()
}, {
  fastify: '^4.x',
  name: 'fastify-better-flash',
  decorators: {
    request: ['session']
  }
})
