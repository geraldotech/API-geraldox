import { openDb } from '../src/configDB.js'

export async function slugExists(slug: string) {
  try {
    const db = await openDb()

    const post = await db.get('SELECT * FROM Posts WHERE slug = ?', slug)

    // If post is != undefined , it means no post with the specified slug was found, so you log a message and throw an error.
    if (post !== undefined) {
      //throw new Error('Another post with same slug already exists')
      return true
    }   

    // console.log('post not found, can create new post')
    // console.log(`wait creating post FN`)
    // console.log(`post created`, { status: 201 })
    return false
    
  } catch (error) {
    console.log(`error`, error)
  }
}
