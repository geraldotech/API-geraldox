import { FastifyInstance } from 'fastify'
import { openDb } from '../configDB.js'

import { getSlugFromString } from '../../utils/getSlugFromString'
/* 
no updates
id 
createD

*/

interface PostData {
  title: string
  article: string
  category: string
  author: string
  component: null | undefined // Corrected type definition
  published: boolean
  vuecomponent: string
}

export async function putPost(app: FastifyInstance) {
  app.put('/post/:slug', async (request, reply) => {
    // tudo que pode ser enviado pelo usuario na criação do post é o mesmo que pode vim a ser editado!

    
    const {slug} = request.params


    const { title, article, category, author, vuecomponent, published } = request.body as PostData

     // Generate a new slug if the title has changed
    const newSlug = getSlugFromString(title)
    

    try {
      const db = await openDb()

      const existingPost = await db.get('SELECT * FROM Posts WHERE slug = ?', slug);
      if (!existingPost) {
        
        reply.status(404).send({ error: 'Post not found' });
        return;
      }

      const stmt = await db.prepare(`
      UPDATE Posts 
      SET 
      title = COALESCE(?, title),
      slug = COALESCE(?, slug),
      article = COALESCE(?, article),
      category = COALESCE(?, category),
      author = COALESCE(?, author),
      vuecomponent = COALESCE(?, vuecomponent),
      published = COALESCE(?, published)
      WHERE slug = ?
      `)

      await stmt.run(title, newSlug, article, category, author, vuecomponent, published, slug)

      // Finalize the statement
      await stmt.finalize()
      //console.log('Post updated successfully')

   // Send response
   reply.status(200).send({ message: 'Post updated successfully', postSlug: newSlug });

      // Close the database connection
      await db.close()
    } catch (error) {
      console.error('Error retrieving post:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  })
}
