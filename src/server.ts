import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { openDb } from './configDB.js'
import { createTable } from './Controller/createTable.js'

import { single } from './routers/single'
import { getPosts } from './routers/getPosts'
import { createPost } from './routers/createPost'
import { deletePost } from './routers/deletePost'
import {putPost} from './routers/putPost'
import { categories } from './routers/categories.js'
import { category } from './routers/category.js'
import { search } from './routers/search.js'
import {slugExists} from '../utils/slugsExists'


const app = fastify()


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
// console.log('slugExists', await slugExists('burnout-revenge-you-can-play-now-323'))

app
  .listen({
    port: 3333,
  })
  .then(() => console.log(`running on port 3333`))
