import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dashboardPosts } from '../../utils/dashboardPosts'
import { dashboardEditPost } from '../../utils/dashboardEditPosts'
import { getBASEURL } from '../../utils/getBASEURL'

//console.log(`your using`, getBASEURL())

export async function dashboard(app: FastifyInstance) {
  try {
    app.get(
      '/dashboard',
      {
        preHandler: [app.authenticate],
      },
      async (request, reply) => {
        const allposts = await dashboardPosts()
        const isAuth = request.cookies.accessToken

        reply.header('Cache-Control', 'no-cache') // Disable caching for this response
        return reply.view('./routes/dashboard.ejs', { allposts: allposts, BASEURL: getBASEURL(), isAuth: isAuth })
      }
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
  }

  app.get('/dashboard/newpost',
  {
    preHandler: [app.authenticate],
  },
  (request, reply) => {
    const isAuth = request.cookies.accessToken

    return reply.view('./routes/newPost.ejs', { text: 'text', BASEURL: getBASEURL(), isAuth: isAuth })
  })

  app.get('/dashboard/edit/:slug', async (request: any, reply) => {
    const { slug } = request.params
    const isAuth = request.cookies.accessToken

    const editPost = await dashboardEditPost(slug)

    return reply.view('./routes/editPost.ejs', { single: editPost, BASEURL: getBASEURL(), isAuth })
  })
}
