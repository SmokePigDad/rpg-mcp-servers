import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  const { character_id, item } = args; // FIX
  if (typeof character_id !== 'number' || !item || typeof item.name !== 'string') {
    return { content: makeTextContentArray(["❌ Invalid input: 'character_id' must be a number and 'item' must be an object with a 'name' string."]), isError: true };
  }
  try {
    const newItem = await db.inventory.add(character_id, item); // Pass item object
    return { content: makeTextContentArray([`✅ Added item "${item.name}" (ID: ${newItem.id}) to character (ID: ${character_id}).`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Error adding item: ${error.message}`]), isError: true };
  }
}