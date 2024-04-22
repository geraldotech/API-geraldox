import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'

import { getSlugFromString } from '../../utils/getSlugFromString'
/* 
no updates
id 
createAt
*/

interface PostData {
  title: string
  article: string
  category: string
  author: string
  component: null | undefined // Corrected type definition
  published: boolean
  vuecomponent: string | null
}

export async function putPost(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/post/:slug',
    {
      schema: {
        body: z.object({
          title: z.string().min(10).max(100).optional(),
          article: z.string().optional(), // keep data in database
          category: z.string().optional(), //if body no send, default, but if send must be string
          author: z.string().optional(),
          vuecomponent: z.string().nullable().optional(), // optional se enviar must be: string or null, default is null
          published: z.boolean().optional(),
        }),
      },
    },
    async (request, reply) => {
      // tudo que pode ser enviado pelo usuario na criação do post é o mesmo que pode vim a ser editado!

      const { slug } = request.params as { slug: string }

      const { title, article, category, author, vuecomponent, published } = request.body as PostData

      // Generate a new slug if the title has changed
      const newSlug = title ? getSlugFromString(title) : title

      try {
        const db = await openDb()

        const existingPost = await db.get('SELECT * FROM Posts WHERE slug = ?', slug)
        if (!existingPost) {
          reply.status(404).send({ error: 'Post not found' })
          return
        }

      const stmt = await db.prepare(`
      UPDATE Posts 
      SET 
      title = COALESCE(?, title),
      slug = COALESCE(?, slug),
      article = COALESCE(?, article),
      category = COALESCE(?, category),
      author = COALESCE(?, author),
      vuecomponent = ?,
      published = COALESCE(?, published)
      WHERE slug = ?
      `)


        await stmt.run(title, newSlug, article, category, author, vuecomponent, published, slug)

        // Finalize the statement
        await stmt.finalize()
        //console.log('Post updated successfully')

        // Send response
        reply.status(200).send({ message: 'Post updated successfully', postSlug: newSlug, vuecomponent })

        // Close the database connection
        await db.close()
      } catch (error) {
        console.error('Error retrieving post:', error)
        reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )
}
