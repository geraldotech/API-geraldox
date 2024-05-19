import { openDb } from '../src/configDB'

// function that return all posts from database
export async function dashboardPosts() {
  try {
    const db = await openDb()

    const allposts = await db.all('SELECT * FROM Posts')

    // Close the database connection
    await db.close()

    // Custom comparison function to compare timestamps in descending order
    function compareTimestampsDescending(a, b) {
      const timestampA = new Date(a.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))
      const timestampB = new Date(b.createdAt?.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'))

      return timestampB - timestampA // Reversed order
    }

    return allposts.sort(compareTimestampsDescending)


  } catch (error) {
    console.error(`error getting all posts`, error)
    return []
  }
}
