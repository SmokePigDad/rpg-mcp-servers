import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_item_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    args.target_type !== 'character' ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.item_id !== 'number' ||
    Number.isNaN(args.item_id)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'target_type' must be 'character', 'target_id' and 'item_id' must be valid numbers."
    ]), isError: true };
  }
  const { target_type, target_id, item_id } = args;

  const success = db.inventory.removeItem(item_id);
  return { content: makeTextContentArray([`✅ Removed item with ID ${item_id} from ${target_type} with ID ${target_id}.`]) };
}