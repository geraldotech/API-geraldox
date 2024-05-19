import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'

export async function getPosts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/posts', async (request, reply) => {
    const authorization = request.headers.authorization?.split(' ')[1]

    if (authorization !== 'GERALDODEVGPDEV') {
      return reply.status(401).send({ message: 'Access Unauthorized' })
    }

    const getPublishedPosts = async () => {
      try {
        const db = await openDb()

        // Execute SQL query to select published posts
        // const posts = await db.all('SELECT * FROM Posts WHERE published = 1')
        const posts = await db.all('SELECT id, title, slug, author, createdAt, article, category, vuecomponent FROM Posts WHERE published = 1')

        // Close the database connection
        await db.close()

        // choose what want return

        // Custom comparison function to compare timestamps in descending order
        function compareTimestampsDescending(a, b) {
          const timestampA = new Date(a.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))
          const timestampB = new Date(b.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))

          return timestampB - timestampA // Reversed order
        }

        return posts.sort(compareTimestampsDescending)

        // Return the selected posts
      //  return posts
      } catch (error: any) {
        console.error('Error fetching published: ', error.message)
        return [] // Return an empty array in case of error
      }
    }

    const allposts = await getPublishedPosts()

    if (!allposts) {
      throw new Error('Posts not found')
    }

    return reply.status(200).send(allposts)
  })
}
