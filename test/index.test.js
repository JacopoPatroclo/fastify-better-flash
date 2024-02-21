'use strict'

const { it, describe } = require('node:test')
const assert = require('node:assert')
const fastifySession = require('@fastify/secure-session')

const key = Buffer.from(
  '677bd4a718ffa6b0d48cb51ea58a3706bcdf27f2f0d8915e21547d99945a74dc',
  'hex'
)

async function makeApp () {
  const app = require('fastify')()
  await app.register(fastifySession, {
    key
  })
  await app.register(require('..'))
  return app
}

describe('fastify-better-flash', () => {
  it('should register the correct decorators', async (t) => {
    const app = await makeApp()

    app.get('/', (req, reply) => {
      assert.equal(!!req.flash, true)
      assert.equal(!!reply.flash, true)
      reply.send('hello')
    })

    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    assert.strictEqual(response.statusCode, 200)
  })

  it('should get and set messages', async (t) => {
    const app = await makeApp()

    app.get('/', (req, reply) => {
      req.flash('some.scope', { message: 'hello' })
      reply.send(reply.flash('some.scope.message'))
    })

    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body, 'hello')
  })

  it('should clear the correct path after getter', async (t) => {
    const app = await makeApp()

    app.get('/', (req, reply) => {
      req.flash('some.scope', { message: 'hello' })
      req.flash('some.otherscope', { message: 'scope2' })

      const scopeMess = reply.flash('some.scope.message')
      assert.equal(scopeMess, 'hello')
      const againScopeMess = reply.flash('some.scope.message')
      assert.equal(againScopeMess, undefined)

      const otherScopeMess = reply.flash('some.otherscope.message')
      assert.equal(otherScopeMess, 'scope2')
      const againOtherScopeMess = reply.flash('some.otherscope.message')
      assert.equal(againOtherScopeMess, undefined)

      const some = reply.flash('some')
      assert.deepStrictEqual(some, { scope: {}, otherscope: {} })
      const someAgain = reply.flash('some')
      assert.deepStrictEqual(someAgain, undefined)

      reply.send('hello')
    })

    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.body, 'hello')
  })
})
