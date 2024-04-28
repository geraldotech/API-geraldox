import { openDb } from '../src/configDB'

// function that return all posts from database
export async function dashboardPosts() {

  try {
    const db = await openDb()

    const allposts = await db.all('SELECT * FROM Posts')

    // Close the database connection
    await db.close()

    return allposts
  } catch (error) {
    console.error(`error getting all posts`, error)
    return []
  } 
}
