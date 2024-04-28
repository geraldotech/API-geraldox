import { openDb } from '../src/configDB.js'

export async function dashboardEditPost(slug: string) {
  try {
    // Open the SQLite database
    const db = await openDb()

    // Execute SQL query to select a published post by slug
    const post = await db.get('SELECT * FROM Posts WHERE slug = ?', slug)

    // Close the database connection
    await db.close()

    // Return the selected post, or null if not found
    return post
  } catch (error: any) {
    console.error('Error fetching published post by slug:', error.message)
    return null // Return null in case of error
  }
}