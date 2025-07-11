// In game-state-server/src/tool-handlers/update_item.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { item_id, updates } = args;

  // --- VALIDATION FIX ---
  // The only parameters needed are the item's unique ID and the update payload.
  if (typeof item_id !== 'number' || !updates || typeof updates !== 'object') {
    return { 
        content: makeTextContentArray(["❌ Invalid input: 'item_id' (number) and 'updates' (object) are required."]), 
        isError: true 
    };
  }
  // --- END FIX ---

  try {
    const result = await db.inventory.updateItem(item_id, updates);
    if (!result) {
      throw new Error(`Item with ID ${item_id} not found.`); // The repo now throws this, but we catch it.
    }
    return { content: makeTextContentArray([`✅ Updated item with ID ${item_id}.`]) };
  } catch (err: any) {
    return {
      content: makeTextContentArray([`❌ Failed to update item: ${err.message}`]),
      isError: true
    };
  }
}