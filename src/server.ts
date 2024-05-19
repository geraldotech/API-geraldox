import { fastify, FastifyReply, FastifyRequest, FastifyNextCallback } from 'fastify'
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
import https from 'https'

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
const fs = require('fs')

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
  secret: process.env.SECRET,
  hook: 'preHandler',
})
//app.register(fastifySession, { secret: process.env.SECRET })

app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies.accessToken

  const requestedUrl = req.url.split('/')[1]

  // console.log(`token`, token)
  // console.log(`token `,req.jwt.verify)

  if (!token) {
    //return reply.status(401).send({ message: 'Authentication required' })
    // Redirect to the login page and query = dashboard
    // return reply.redirect('/login?page=dashboard')
    return reply.redirect(`/login?page=${requestedUrl}`)
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
  // templates: 'views',
  templates: path.join(__dirname, 'views'), // Specify the path to your views directory
})

function getCurrentBASE ()  {
  const base = process.env.BASEURL
  return base
}



// === Middlewares ===
// https://fastify.dev/docs/latest/Reference/Hooks/#onrequest
// app.addHook('onRequest', (request, reply, done) => {
//   console.log('This is a middleware.', request.body);
//   // Call next to pass control to the next matching route or handler
//   done();
// });

interface TheParams {
  req: FastifyRequest
  res: FastifyReply
  next: FastifyNextCallback
}

const myMiddleware = (req, res, next) => {
  console.log('This is my middleware')
  next() // Call next to move to the next middleware or route handler
}

function mycats(req, res, next) {
  console.log('This is the preHandler for /gatos')
  const auth = req.cookies.accessToken

  // send auth status for allroutes
  if (!auth) {
    req.authStatus = { auth: false }
    next()
    return
  }
  req.authStatus = { auth: true }
  next()
}

// Register the middleware with Fastify
app.register(myMiddleware)

// === Middlewares ===

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//createTable()
//openDb();

app.get('/', (request, reply) => {
  // return 'Hello World home'
  reply.view('/routes/home.ejs')
})

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

app.get(
  '/gatos',
  {
    preHandler: mycats,
  },
  (req, reply) => {
    // 👉 getting autho from middle
    const { auth } = req.authStatus

    //👉 set custom headers isauth
    // send a get include the headers in httpie
    const { isauth } = req.headers
    isauth ? console.log(`logado`, isauth) : console.log(`not logado`)

    //check value if need
    console.log(isauth === 'MASTERPIECE')

    //👉 using the basic auth in httpie you can get value with:
    console.log(req.headers.authorization)

    // slit only the authorization 'Bearer masterok'
    //console.log(req.?headers.?authorization.split(' ')[1] === 'masterok')

    // PS vc consegue enviar headers and auth same time, chooice one

    reply.send(`ok cats your auth status is: ${auth}`)
  }
)

// === AREA TESTES  ===

// slugExists('download-windows-10-pro-mais-alem').then(r => console.log(r))
//getSingle(1).then(r => console.log(r))
//updateSingle(null, 10).then(r => console.log(r))

//slugsExistsOnEdit('api-geraldox', '9').then(r => console.log(`em uso`, r))

// ====== MAIN =======
app
  .listen({
    port: 4444,
  })
  .then(() => console.log(`running on port 4444`))


// app.listen(4444, '0.0.0.0', (err) => {
//   if (err) {
//     console.error(err)
//     process.exit(1)
//   }
//   console.log('HTTP Server is running on port 4444')
// })
