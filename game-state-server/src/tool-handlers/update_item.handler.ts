import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function update_item_handler(args: any) {
  const { target_type, target_id, item_id, updates } = args;
  const db = new GameDatabase();
  const item = db.inventory.updateItem(item_id, updates);

  if (!item) {
    return { content: makeTextContentArray([`❌ Could not update item with ID ${item_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Updated item with ID ${item_id}.`]) };
}