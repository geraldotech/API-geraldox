import { FastifyInstance } from 'fastify'

import { openDb } from '../configDB.js'

const handleDelete = async (slug: string) => {
  try {
    // Open the SQLite database
    const db = await openDb()

    // Execute SQL query to select a published post by slug
    const performs = await db.run('DELETE FROM Posts WHERE slug = ?', slug)

    // Close the database connection
    await db.close()

    if (performs.changes > 0) {
      // Return a success message or perform any other actions
      return {
        message: 'Post deleted successfully',
      }
    } else {
      // Handle the case where no post was found to delete
      return {
        message: 'No post found with the specified slug',
        statusCode: false,
      }
    }
  } catch (error: any) {
    console.error('Error delete post:', error.message)
    return null // Return null in case of error
  }
}

export async function deletePost(app: FastifyInstance) {
  app.delete('/post/:slug',   {
    preHandler: [app.authenticate] }, async (request: any, reply) => {
    const { slug } = request.params

    const post = await handleDelete(slug)

    return reply.status(201).send({message: post.message})
  })
}
