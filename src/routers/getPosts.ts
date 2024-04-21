import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'

export async function getPosts(app: FastifyInstance) {
  app
  
  .get('/posts', 
  async (request, reply) => {

    const getPublishedPosts = async () => {
      try {
        const db = await openDb()

        // Execute SQL query to select published posts
        const posts = await db.all('SELECT * FROM Posts WHERE published = 1')

        // Close the database connection
        await db.close()

        // Return the selected posts
        return posts
      } catch (error: any) {
        console.error('Error fetching published: ', error.message)
        return [] // Return an empty array in case of error
      }
    }

    const allposts = await getPublishedPosts()

    if (!allposts) {
      throw new Error('Posts not found')
    }

    return reply.send(allposts)
  })
}
