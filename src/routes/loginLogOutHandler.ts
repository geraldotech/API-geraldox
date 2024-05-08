import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

interface LoginData {
  user: string
  password: string
}

export async function loginLogOutHandler(app: FastifyInstance) {
  // Middleware for token verification
  // app.addHook('onRequest', async (request, reply) => {
  //   console.log(`ok`)
  //   try {
  //     await request.jwtVerify()
  //   } catch (err) {
  //     // If verification fails, send an error response
  //     reply.code(401).send({ message: 'Unauthorized' })
  //   }
  // })

  app.get('/login', (req: FastifyRequest, reply: FastifyReply) => {
    // request.session.set<any>("not", "happy")

    return reply.view('./routes/login.ejs', {})
  })

  app.post('/login', (req: FastifyRequest, reply: FastifyReply) => {
    const { user, password } = req.body as LoginData

    if (user === 'geraldo' && password === '123') {

      const payload = {
        id: 1,
        user: 'geraldo',
      }

      // const token = app.jwt.sign({ id }, process.env.SECRET, {
      //   expiresIn: 10, // expires in 5min
      // })
      const token = req.jwt.sign(payload)

      // Set the JWT token in the session cookie

      reply.setCookie('accessToken', token, {
        path: '/',
        httpOnly: true,
        secure: false, // Enable this in production for HTTPS
      })
      // if no query send to
      let redirectTo = req.query.page && req.query.page !== 'null' ? req.query.page : '/'

      return reply.status(200).send({ redirectUrl: redirectTo, accessToken: token })
      // return { accessToken: token }
      // return reply.send({ auth: true, token: token })
      // Redirect the user to the page they were trying to access before

      // Redirect the user to the page they were trying to access before
      // const redirectTo = req.query.page || '/' // Default to homepage if no redirect query parameter is provided

      // Return the redirect URL along with the token
      // reply.send({ redirectUrl: redirectTo, accessToken: token })
    }
    reply.status(500).send({ message: 'Login invalido' })
  })

  // === logout //
  // Aqui apenas dizemos ao requisitante para anular o token, embora esta rota de logout seja completamente opcional uma vez que no próprio client-side é possível destruir o cookie ou localstorage de autenticação e com isso o usuário está automaticamente deslogado. Se nem o client-side ou o server-side destrua o token, ele irá expirar sozinho em 5 minutos.
  app.get('/logout', (req, reply) => {
    reply.setCookie('accessToken', '', {
      expires: new Date(0), // Set expiration time to epoch
      httpOnly: true,
      secure: true, // Enable this in production for HTTPS
    })

    const htmlResponse = `
    <html>
    <head>
        <title>Logout Page</title>
    </head>
    <body>
        <h1>Logout Successful</h1>
        <p>Your logout was successful. Thank you for using our service!
        <a href="/login">Login page</a>
        </p>
    </body>
    </html>
`;

return reply.type('text/html').send(htmlResponse);

    //return reply.send({ message: 'Logout successful' })
  })
}
