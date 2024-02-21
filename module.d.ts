declare module 'fastify-better-flash' {
  import { FastifyPluginCallback } from 'fastify'

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface FlashSessionType {}

  const betterflash: FastifyPluginCallback<() => string>
  export default betterflash
}
