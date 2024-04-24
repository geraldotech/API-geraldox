import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { createTable } from './Controller/createTable.js'

import { single } from './routers/single'
import { getPosts } from './routers/getPosts'
import { createPost } from './routers/createPost'
import { deletePost } from './routers/deletePost'
import { putPost } from './routers/putPost'
import { categories } from './routers/categories.js'
import { category } from './routers/category.js'
import { search } from './routers/search.js'
import { fastifyCors } from '@fastify/cors'

const path = require('node:path')
import fastifyStatic from '@fastify/static'

const app = fastify()


app.register(fastifyCors, {
  origin:'*',
})

const publicFolder = path.join(__dirname, '../public');

app.register(fastifyStatic, {
  root: publicFolder,
  prefix: '/public/', // Specify the prefix for serving static files
});
 
app.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
  templates: 'views',
})

// Define a route to render the HTML page
app.get('/dashboard', (request, reply) => {

  if('newpost' in request.query){
    reply.view('./routes/newpost.ejs', {text: 'text'})
  }

  reply.view('./routes/dashboard.ejs', { text: 'text' })
})

app.get('/newpost', (request, reply) => {
  reply.view('./routes/newpost.ejs', {text: 'text'})
})


// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//createTable()
//openDb();

app.get('/', () => {
  return 'Hello World'
})

app.register(createPost)
app.register(single)
app.register(getPosts)
app.register(deletePost)
app.register(putPost)
app.register(categories)
app.register(category)
app.register(search)

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
