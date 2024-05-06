import { fastify, FastifyReply, FastifyRequest } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { createTable } from './Controller/createTable.js'
import { single } from './routes/single.js'
import { getPosts } from './routes/getPosts.js'
import { createPost } from './routes/createPost.js'
import { deletePost } from './routes/deletePost.js'
import { putPost } from './routes/putPost.js'
import { categories } from './routes/categories.js'
import { category } from './routes/category.js'
import { search } from './routes/search.js'
import { dashboard } from './routes/dashboard.js'
import { clientes } from './routes/clients.js'
import { fastifyCors } from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { loginLogOutHandler } from './routes/loginLogOutHandler.js'

import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'

const path = require('node:path')
const jwt = require('jsonwebtoken')
import { JWT } from '@fastify/jwt'

import { slugExists } from '../utils/slugsExists.js'
import { slugsExistsOnEdit } from '../utils/slugsExistsOnEdit.js'
import dotenv from 'dotenv-safe'
dotenv.config()
//const fastifyJwt = require('@fastify/jwt')
import fjwt, { FastifyJWT } from '@fastify/jwt'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(require('@fastify/formbody'))

// adding jwt property to req
// authenticate property to FastifyInstance
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

// JWT
app.register(fjwt, { secret: process.env.SECRET })
app.addHook('preHandler', (req, res, next) => {
  req.jwt = app.jwt
  return next()
})

// cookies
app.register(fastifyCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
})
//app.register(fastifySession, { secret: process.env.SECRET })

app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies.accessToken

  // console.log(`token`, token)
  // console.log(`token `,req.jwt.verify)

  if (!token) {
   return reply.status(401).send({ message: 'Authentication required' })
    // Redirect to the login page
    //return reply.redirect('/login')
  }
  // here decoded will be a different type by default but we want it to be of user-payload type
  const decoded = req.jwt.verify<FastifyJWT['id']>(token)
  req.id = decoded
})

const publicFolder = path.join(__dirname, '../public')

app.register(fastifyStatic, {
  root: publicFolder,
  prefix: '/public/', // Specify the prefix for serving static files
})

app.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
  templates: 'views',
})

// Middleware example

// https://fastify.dev/docs/latest/Reference/Hooks/#onrequest
// app.addHook('onRequest', (request, reply, done) => {
//   console.log('This is a middleware.', request.body);
//   // Call next to pass control to the next matching route or handler
//   done();
// });

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//createTable()
//openDb();

/* app.get('/', () => {
 // return 'Hello World home'
}) */

app.get('/', (request, reply) => {
  reply.view('./routes/home.ejs')
})

app.get('/newpost', (request, reply) => {
  reply.view('./routes/newPost.ejs', { text: 'text' })
})

app.get(
  '/gato',
  {
    preHandler: [app.authenticate],
  },
  (req, reply) => {
    reply.send('ok gatos ')
  }
)

app.register(createPost)
app.register(single)
app.register(getPosts)
app.register(deletePost)
app.register(putPost)
app.register(categories)
app.register(category)
app.register(search)
app.register(dashboard)
app.register(loginLogOutHandler)
app.register(clientes)

// === AREA TESTES  ===

// slugExists('download-windows-10-pro-mais-alem').then(r => console.log(r))
//getSingle(1).then(r => console.log(r))
//updateSingle(null, 10).then(r => console.log(r))

//slugsExistsOnEdit('api-geraldox', '9').then(r => console.log(`em uso`, r))

// ====== MAIN =======
app
  .listen({
    port: 3333,
  })
  .then(() => console.log(`running on port 3333`))
