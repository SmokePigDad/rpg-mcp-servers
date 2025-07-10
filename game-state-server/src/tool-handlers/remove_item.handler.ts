import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_item_handler(args: any) {
  const { target_type, target_id, item_id } = args;
  const db = new GameDatabase();
  const success = db.inventory.removeItem(item_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove item with ID ${item_id} from ${target_type} with ID ${target_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Removed item with ID ${item_id} from ${target_type} with ID ${target_id}.`]) };
}