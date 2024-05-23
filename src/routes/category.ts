import { FastifyInstance } from 'fastify'
import { openDb } from '../configDB.js'
import {compareTimestampsDescending} from '../../utils/compareTimestamp.js'

export async function category(app: FastifyInstance) {
  app.get('/posts/category', async (request, reply) => {
    
    const { name } = request.query as { name: string }
    const query = request.query as Record<string, string>
    const hasQueryParams: boolean = 'name' in query

    if (!hasQueryParams) {
      reply.redirect('/posts/categories')
    }

    try {
      const db = await openDb()

      let sql = 'SELECT * FROM Posts'

      const params: any[] = []

      if (name) {
        sql += ' WHERE category = ?'
        params.push(name)
      }

      // Execute the SQL query with optional category filter
      const posts = await db.all(sql, params)

      // Close the database connection
      await db.close()

      if (!posts.length) {
        reply.send(`No posts found for ${name}`)
      }

      // Send the filtered posts as the response
      reply.send(posts.sort(compareTimestampsDescending))

      if (!name) {
        reply.send('')
      }
    } catch (error) {
      console.error('Error fetching posts by category:', error)
      reply.status(500).send({ error: 'Internal Server Error' })
    }
  })
}
