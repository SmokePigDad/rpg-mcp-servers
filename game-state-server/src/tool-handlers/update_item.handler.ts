import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, item_id, updates } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool update_item only supports target_type 'character' at this time."]), isError: true };
  }
  console.log('[UPDATE_ITEM] Attempting to update item:', item_id, updates);
  const result = await db.inventory.updateItem(item_id, updates);

  if (!result || (typeof result.changes === 'number' && result.changes === 0)) {
    console.warn('[UPDATE_ITEM] Zero rows affected; item may not exist:', item_id);
    return { content: makeTextContentArray([`❌ Item with ID ${item_id} not found or not updated.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Updated item with ID ${item_id}.`]) };
}