import fastify from 'fastify'
import example, { Path, PathToValue } from '..'
import { expectType } from 'tsd'

// Extend globaly the FlashSessionType
declare module 'fastify-better-flash' {
  export interface FlashSessionType {
    info: string
    errors: Array<{
      message: string
      gravity: 'high' | 'low'
    }>
    success: boolean
  }
}

let app
try {
  interface SimplerUseCase {
    a: string
    b: Array<{
      stuff: string
    }>
  }
  type PathTypeForExample = Path<SimplerUseCase>
  expectType<PathTypeForExample>('a' as 'a' | 'b' | `b.${number}` | `b.${number}.stuff`)

  type PathTOValueForArrayAndInnerObj = PathToValue<SimplerUseCase, 'b.0'>
  const result: { stuff: string } = { stuff: 'asd' }
  expectType<PathTOValueForArrayAndInnerObj>(result)

  type PathToSomeElementInArray = PathToValue<SimplerUseCase, 'b.2.stuff'>
  expectType<PathToSomeElementInArray>('string' as string)

  app = fastify()
  void app.ready()
  void app.register(example)
  app.get('/', (req, reply) => {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    expectType<void>(req.flash('info', 'hello'))
    expectType<string | undefined>(reply.flash('info'))
  })

  app.get('/', (req, reply) => {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    expectType<void>(req.flash('success', true))
    expectType<string | undefined>(reply.flash('errors.0')?.message)
  })
} catch (err) {
  console.error(err)
}
