import { openDb } from '../src/configDB.js'

export async function updateSingle(vuecomponent: string, id: number) {
  try {
    // Open the SQLite database
    const db = await openDb()

    // Execute SQL query to select a published post by slug
    const query = `UPDATE Posts SET vuecomponent = ? WHERE id = ?`

    // Execute the query
    await db.run(query, [vuecomponent, id])

    // Close the database connection
    await db.close()
  } catch (error) {
    console.error('Error:', error)
  }
}
