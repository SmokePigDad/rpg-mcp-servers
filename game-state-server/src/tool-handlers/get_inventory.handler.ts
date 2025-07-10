import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_inventory_handler(db: GameDatabase, args: any) {
  const { target_type, target_id } = args;

  if (target_type !== 'character') {
    return { content: makeTextContentArray(["❌ Tool get_inventory only supports target_type 'character' at this time."]), isError: true };
  }
  const inventory = db.inventory.getInventory(target_id);

  return { content: makeTextContentArray([JSON.stringify(inventory, null, 2)]) };
}