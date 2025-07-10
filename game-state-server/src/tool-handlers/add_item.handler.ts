import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function add_item_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    args.target_type !== 'character' ||
    !Object.prototype.hasOwnProperty.call(args, 'target_id') ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.item_name !== 'string' ||
    args.item_name.trim().length === 0
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid input: 'target_type' must be 'character', 'target_id' must be a valid number, and 'item_name' must be a non-empty string."
    ]), isError: true };
  }

  const { target_type, target_id, item_name, description } = args;
  try {
    const newItem = await db.inventory.add(target_id, { name: item_name, description: description });
    return { content: makeTextContentArray([`✅ Added item "${item_name}" (ID: ${newItem.id}) to character (ID: ${target_id}).`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Error adding item: ${error.message}`]), isError: true };
  }
}