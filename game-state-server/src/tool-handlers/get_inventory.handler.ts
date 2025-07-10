import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_inventory_handler(args: any) {
  const { target_type, target_id } = args;
    const db = new GameDatabase();
  // TODO: Implement get inventory logic to the InventoryRepository
  return { content: makeTextContentArray([`Tool get_inventory is not yet fully implemented.`]) };
}