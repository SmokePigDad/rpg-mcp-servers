import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, item_id, updates } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool update_item only supports target_type 'character' at this time."]), isError: true };
  }
  const item = db.inventory.updateItem(item_id, updates);

  return { content: makeTextContentArray([`✅ Updated item with ID ${item_id}.`]) };
}