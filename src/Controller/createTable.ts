import { openDb } from '../configDB.js'

/* export default async function createTable(){
  openDb().then(db => {
    db.exec('CREATE TABLE IF NOT EXISTS Posts (id INTEGER PRIMARY KEY, )')
  })
}
 */

export async function createTable() {
  try {
    // Open the SQLite database
    const db = await openDb()

    // Execute SQL command to create the table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        author TEXT NOT NULL,
        published BOOLEAN DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        article TEXT NOT NULL,
        category TEXT,
        vuecomponent TEXT
      )
    `)

    console.log('Table "Posts" created successfully')

    // Close the database connection
    await db.close()
  } catch (error: any) {
    console.error('Error creating table:', error.message)
  }
}
