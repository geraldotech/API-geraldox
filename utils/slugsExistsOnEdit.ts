import { openDb } from '../src/configDB.js';

export async function slugsExistsOnEdit(slug: string, id: number) {
  try {
    const db = await openDb();

    // Check if any post with the specified slug exists, excluding the current post ID
    const query = await db.get('SELECT * FROM Posts WHERE slug = ? AND id != ?', [slug, id]);

    // If query is not undefined, it means another post with the same slug exists (excluding the current post)
    if (query !== undefined) {
      return true; // Slug exists and is used by another post
    } else {
      return false; // Slug does not exist or is used by the current post
    }

  } catch (error) {
    console.log('Error:', error);
    throw error; // Rethrow the error to handle it in the caller function
  }
}
