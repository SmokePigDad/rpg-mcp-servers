import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_item_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, item_id } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool remove_item only supports target_type 'character' at this time."]), isError: true };
  }
  const success = db.inventory.removeItem(item_id);

  return { content: makeTextContentArray([`✅ Removed item with ID ${item_id} from ${target_type} with ID ${target_id}.`]) };
}