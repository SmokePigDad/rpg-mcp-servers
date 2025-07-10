import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_inventory_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== "string" ||
    args.target_type !== "character" ||
    !Object.prototype.hasOwnProperty.call(args, "target_id") ||
    typeof args.target_id !== "number" ||
    Number.isNaN(args.target_id)
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments. 'target_type' must be 'character' and 'target_id' must be a valid number."
      ]),
      isError: true
    };
  }
  const { target_type, target_id } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool get_inventory only supports target_type 'character' at this time."]), isError: true };
  }
  const inventory = db.inventory.getInventory(target_id);

  return { content: makeTextContentArray([JSON.stringify(inventory, null, 2)]) };
}