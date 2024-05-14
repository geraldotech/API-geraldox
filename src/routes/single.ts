import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'

async function singlePost(slug: string) {
  try {
    // Open the SQLite database
    const db = await openDb()

    // Execute SQL query to select a published post by slug
    const post = await db.get('SELECT * FROM Posts WHERE slug = ? AND published = 1', slug)

    // Close the database connection
    await db.close()

    // Return the selected post, or null if not found
    return post
  } catch (error: any) {
    console.error('Error fetching published post by slug:', error.message)
    return null // Return null in case of error
  }
}

export async function single(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/post/:slug', async (request: any, reply) => {
    const { slug } = request.params

    const single = await singlePost(slug)

    if (!single) {
      //throw new Error('Post not found')
      return reply.status(404).send({
        message: "We're sorry, but the post you are looking for could not be found, has been removed, or is currently unavailable. It may have been archived or deleted",
        // to show stats in show response statusCode: 404,
      })
    }

    return reply.send(single)
  })
}
