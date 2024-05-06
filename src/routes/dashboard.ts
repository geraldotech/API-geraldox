import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dashboardPosts } from '../../utils/dashboardPosts'
import {dashboardEditPost} from '../../utils/dashboardEditPosts'


export async function dashboard(app: FastifyInstance) {
  try {
    
    app.get('/dashboard', {
      preHandler: [app.authenticate],
    }, async (request, reply) => {     
    
      const allposts = await dashboardPosts()
      reply.header('Cache-Control', 'no-cache') // Disable caching for this response
      return reply.view('./routes/dashboard.ejs', {  allposts: allposts })
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
  }

  app.get('/dashboard/newpost', (request, reply) => { 
      return reply.view('./routes/newPost.ejs', { text: 'text' })       
  })

  app.get('/dashboard/edit/:slug', async (request: any, reply) => {
    const {slug} = request.params

    const editPost = await dashboardEditPost(slug)

    return reply.view('./routes/editPost.ejs', { single: editPost })       
    
  })
}
