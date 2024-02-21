# fastify-better-flash

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  ![CI workflow](__MY_PLUGIN_URL__
/workflows/CI%20workflow/badge.svg)

This plugin is inspired by the [@fastify/flash](https://github.com/fastify/fastify-flash/tree/master) plugin. The main difference is the way it access the messages, using a "dot syntax" and it has a better typescript support. See below for more details.

Supports Fastify versions `4.x`

## Install
```sh
npm i fastify-better-flash @fastify/secure-session
```
```sh
pnpm i fastify-better-flash @fastify/secure-session
```
```sh
yarn add fastify-better-flash @fastify/secure-session
```


## Usage
Flash messages are stored in the session. First, we need to register the session plugin: (@fastify/secure-session)[https://www.npmjs.com/package/@fastify/secure-session].

```js
const fastify = require('fastify')()
const fastifySession = require('@fastify/secure-session')

fastify.register(fastifySession, {
  // adapt this to point to the directory where secret-key is located
  key: fs.readFileSync(path.join(__dirname, 'secret-key')),
  cookie: {
    // options from setCookie, see https://github.com/fastify/fastify-cookie
  }
})
fastify.register(require('fastify-better-flash'))

fastify.listen({ port: 3000 })
```

### Usage

In your route handler you can use the `flash` method to set a flash message.
Let's say that we want to have the following messages:

```
  success: boolean
  validations: {
    errors: Array<{ field: string, message: string }>
  }
  genericError: string
```

we can set them in the route handler like this:

```js

fastify.get('/', async (request, reply) => {
  request.flash('success', true)
  request.flash('validations.errors', [{ field: 'email', message: 'Email is required' }])
  request.flash('genericError', 'Something went wrong')
})

```

Then we can consume them like this:

```js

fastify.get('/flash', async (request, reply) => {
  const success = reply.flash('success')
  // Note that we can access the nested object using the dot notation
  const validation = reply.flash('validations')
  const validationErrors = validation ? validation.errors : []
  // it works with arrays too, this will return the first error field property
  const validationErrors = reply.flash('validations.errors.0.field')
  const genericError = reply.flash('genericError')
  return { success, validationErrors, genericError }
})

```

### Typescript

You can define the schema of your flash messages using typescript.
By using the `fastify-better-flash` module you can customize the interface `FlashSessionType` that be extended to define the schema of your flash messages.

```ts

declare module 'fastify-better-flash' {
  export interface FlashSessionType {
    // Define your flash message schema here
    success: boolean
    validations: {
      errors: Array<{ field: string, message: string }>
    }
  }
}

```

And then in your route handler you can use the `flash` method to set a flash message.

```ts

fastify.get('/', async (request, reply) => {
  // Also the keys will be typed
  request.flash('success', 'This is a success message') // This will not compile

  const validationErrors = reply.flash('validations.errors') // This will have the correct types
  return reply.redirect('/flash')
})

```

By design the getter method `flash` will alaways return the type that you have defined or `undefined`. This is meant to signal the developer that the presence of the object in the flash session storage is not guaranteed on every request.

## Acknowledgements

## License

Licensed under [MIT](./LICENSE).<br/>
