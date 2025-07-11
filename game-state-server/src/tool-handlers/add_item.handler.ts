import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  const { character_id, item } = args; // FIX
  if (typeof character_id !== 'number' || !item || typeof item.name !== 'string') {
    return { content: ["❌ Invalid input: 'character_id' must be a number and 'item' must be an object with a 'name' string."].map(makeTextContent), isError: true };
  }
  try {
    const newItem = await db.inventory.add(character_id, item); // Pass item object
    return { content: [`✅ Added item "${item.name}" (ID: ${newItem.id}) to character (ID: ${character_id}).`].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error adding item: ${error.message}`].map(makeTextContent), isError: true };
  }
}