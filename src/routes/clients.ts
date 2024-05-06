import { FastifyInstance, preHandlerHookHandler } from 'fastify'

export async function clientes(app: FastifyInstance) {
  //Middleware for token verification

  // app.addHook('onRequest', async (request, reply) => {
  //   try {
  //     // await request.jwtVerify()
  //     // Retrieve JWT token from the session
  //     const token = request.session.get('token')
  //     console.log(request.session.user)
  //     console.log(request.session.get('user'))
  //     // Verify JWT token
  //     await app.jwt.verify(token)
  //   } catch (err) {
  //     // If verification fails, send an error response
  //     reply.code(401).send({ message: 'Unauthorized' })
  //   }
  // })

  // Middleware for token verification
  const tokenVerificationHandler: preHandlerHookHandler = async (request, reply) => {
    try {
      // Retrieve JWT token from the session
      //const token = request.session.get('token');

      const token = request.cookies.accessToken
      console.log(token)

      if (!token) {
        return reply.status(401).send({ message: 'Authentication required' })
      }

      // here decoded will be a different type by default but we want it to be of user-payload type
      // const decoded = request.jwt.verify<FastifyJWT['user']>(token)
      // request.user = decoded

      // Verify JWT token
      // await request.jwtVerify()

    } catch (err) {
      // If verification fails, send a 401 Unauthorized response
      reply.code(401).send({ message: 'Unauthorized' })
    }
  }

  app.get('/clients', { preHandler: tokenVerificationHandler }, async (request, reply) => {
    return reply.send([{ id: 1, nome: 'luiz' }])
  })
}
