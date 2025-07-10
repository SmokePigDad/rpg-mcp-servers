import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_inventory_handler(args: any) {
  const { target_type, target_id } = args;
    const db = new GameDatabase();
    const inventory = db.inventory.getInventory(target_id);
  
    if (!inventory) {
      return { content: makeTextContentArray([`❌ Could not get inventory for ${target_type} with ID ${target_id}.`]), isError: true };
    }
  
    return { content: makeTextContentArray([JSON.stringify(inventory, null, 2)]) };
  }