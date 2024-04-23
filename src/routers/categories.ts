import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'

export async function categories(app: FastifyInstance) {
  app.get('/posts/categories', async (request, reply) => {
    try {
      // Open the SQLite database
      const db = await openDb()

      // Execute SQL query to select category and count of posts
      const result = await db.all(`
      SELECT category, COUNT(*) AS post_count
      FROM Posts
      GROUP BY category
      `)

      // Process the result to construct the desired array structure
    /*   const categoriesWithPostCount = result.map((row: any) => ({
        cat: row.category,
        posts: row.post_count,
      })) */

      //console.log(result)
      return reply.send(result)
    } catch (error) {
      console.log(`error`)
    }
  })
}
