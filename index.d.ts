import './module.d'
import { FastifyPluginCallback } from 'fastify'
import { FlashSessionType } from 'fastify-better-flash'

declare module 'fastify' {
  export interface FastifyRequest {
    flash: <PathType extends Path<FlashSessionType>>(scope: PathType, message: PathToValue<FlashSessionType, PathType>) => void
  }
  export interface FastifyReply {
    flash: <PathType extends Path<FlashSessionType>>(scope: PathType) => PathToValue<FlashSessionType, PathType> | undefined
  }
}

export type Path<T = unknown> = T extends object
  ? T extends Array<infer ItemType>
    ? ItemType extends object ? `${number}` | `${number}.${Path<ItemType>}` : `${number}`
    : { [K in keyof T]: T[K] extends object ? `${K & string}` | `${K & string}.${Path<T[K]>}` : `${K & string}` }[keyof T]
  : string

export type PathToValue<T = unknown, P extends Path<T> = Path<T>> =
      T extends object
        ? P extends keyof T
          ? T[P]
          : P extends `${infer Key}.${infer Rest}`
            ? Key extends keyof T
              ? Rest extends Path<T[Key]>
                ? PathToValue<T[Key], Rest>
                : never
              : T extends Array<infer ItemType>
                ? Rest extends Path<ItemType>
                  ? PathToValue<ItemType, Rest>
                  : never
                : never
            : P extends `${number}`
              ? T extends Array<infer ItemType>
                ? ItemType
                : never
              : never
        : any

declare const betterflash: FastifyPluginCallback<() => string>
export default betterflash
