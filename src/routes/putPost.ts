import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { openDb } from '../configDB.js'
import { createdAt2 } from '../../utils/createdAt'
import { slugsExistsOnEdit } from '../../utils/slugsExistsOnEdit.js'
/* 
no updates
id 
createAt
*/

interface PostData {
  id: string
  title: string
  article: string
  category: string
  author: string
  component: null | undefined // Corrected type definition
  published: boolean
  vuecomponent: string | null
  updateslug: boolean
  newslug: string
}


const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(10).max(100).optional(),
  createdAt: z.string().optional(),
  article: z.string().optional(), // keep data in database
  category: z.string().optional(), //if body no send, default, but if send must be string
  author: z.string().optional(),
  published: z.boolean().optional(),
  vuecomponent: z.string().nullable().optional(), // optional se enviar must be: string or null, default is null
  updateslug: z.boolean().optional(), //if true can send a new slug form
  newslug: z.string().max(75).optional(),
})

export async function putPost(app: FastifyInstance) {
  app.put<{ Body: ZodType<typeof postSchema> }>(
    '/post/:slug',
    {
      preHandler: [app.authenticate],
      schema: {
        body: postSchema,
      },
    },
    async (request, reply) => {
      
      const { slug } = request.params as { slug: string }
      
      // tudo que pode ser enviado pelo usuario na criação do post é o mesmo que pode vim a ser editado!
      const { id, title, createdAt, article, category, author, published, vuecomponent, updateslug, newslug } = request.body as PostData

     
      const shouldUpdateSlug = updateslug

      let newSlug
      const slugsExistsOnEditCheck = await slugsExistsOnEdit(newslug, id)
      if (shouldUpdateSlug) {
        if (slugsExistsOnEditCheck) {
          return reply.status(409).send({ error: 'Slug exists and is used by another post' })
        }
        if (!slugsExistsOnEditCheck) {
          newSlug = shouldUpdateSlug ? newslug : slug
        }
      }

      try {
        const db = await openDb()

        const existingPost = await db.get('SELECT * FROM Posts WHERE slug = ?', slug)
        if (!existingPost) {
          reply.status(404).send({ error: 'Post not found' })
          return
        }

        const lastupdate = createdAt2()

        // Construct the SQL query string
        const sql = `
        UPDATE Posts 
        SET 
          title = COALESCE(?, title),
          createdAt = COALESCE(?, createdAt),
          slug = COALESCE(?, slug),
          article = COALESCE(?, article),
          category = COALESCE(?, category),
          author = COALESCE(?, author),
          published = COALESCE(?, published),
          lastupdate = COALESCE(?, lastupdate),
          vuecomponent = ?
          WHERE slug = ?`

        // Prepare the SQL statement
        const stmt = await db.prepare(sql)

        // Execute the SQL statement with appropriate parameters
        if (vuecomponent === null || vuecomponent === '') {
          // If vuecomponent is null, bind null value
          await stmt.run(title, createdAt, newSlug, article, category, author, published, lastupdate, null, slug)
        } else {
          // If vuecomponent is not null, bind the provided value
          await stmt.run(title, createdAt, newSlug, article, category, author, published, lastupdate, vuecomponent, slug)
        }

        // Finalize the statement
        await stmt.finalize()

        //console.log(stmt) Statement { stmt: Statement { lastID: 0, changes: 1 } }
        //console.log('Post updated successfully')

        // Send response
        reply.status(200).send({ message: 'Post updated successfully', updateslug, slug: newSlug, vuecomponent })

        // Close the database connection
        await db.close()
      } catch (error) {
        console.error('Error retrieving post:', error)
        reply.status(500).send({ error: 'Internal Server Error' })
      }
    }
  )
}
