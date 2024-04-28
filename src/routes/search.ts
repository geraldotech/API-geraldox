import { FastifyInstance } from 'fastify'
import { openDb } from '../configDB'

export async function search(app: FastifyInstance) {
  app.get('/posts/search', async (request, reply) => {
    const { q } = request.query as { q: string }

    if (q.length <= 2) {
      return reply.status(400).send('Title query parameter must be at least three characters long')
    }

    try {
      const db = await openDb()

      const query = 'SELECT * FROM Posts WHERE title LIKE ?'

      const posts = await db.all(query, [`%${q}%`])

      await db.close()

      if (!posts.length) {
        reply.send('not posts found')
      }
      reply.send(posts)

    } catch (error) {
      console.error('Error search posts:', error)
    }
  })
}
