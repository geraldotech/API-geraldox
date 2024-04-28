import { fastify } from 'fastify'
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
import { fastifyCors } from '@fastify/cors'

const path = require('node:path')
import fastifyStatic from '@fastify/static'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
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

// Define a route to render the HTML page
/* app.get('/dashboard', (request, reply) => {

  if('newpost' in request.query){
    reply.view('./routes/newpost.ejs', {text: 'text'})
  }

  reply.view('./routes/dashboard.ejs', { text: 'text', allposts: '' })
}) */


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


app.register(createPost)
app.register(single)
app.register(getPosts)
app.register(deletePost)
app.register(putPost)
app.register(categories)
app.register(category)
app.register(search)
app.register(dashboard)

// === AREA TESTES  ===
// console.log('slugExists', await slugExists('burnout-revenge-you-can-play-now'))
// slugExists('burnout-revenge-you-can-play-now').then(r => console.log(r))

//getSingle(1).then(r => console.log(r))
//updateSingle(null, 10).then(r => console.log(r))

app
  .listen({
    port: 3333,
  })
  .then(() => console.log(`running on port 3333`))
