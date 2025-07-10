import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, item_name, description } = args;
  
  // Input validation
  if (!target_type || !target_id || !item_name) {
    return { content: makeTextContentArray(["❌ Missing required fields: target_type, target_id, and item_name."]), isError: true };
  }

  try {
    if (target_type !== 'character') {
      return { content: makeTextContentArray(["❌ Tool add_item only supports target_type 'character' at this time."]), isError: true };
    }
    const newItem = await db.inventory.add(target_id, { name: item_name, description: description });
    return { content: makeTextContentArray([`✅ Added item "${item_name}" (ID: ${newItem.id}) to character (ID: ${target_id}).`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Error adding item: ${error.message}`]), isError: true };
  }
}