// In game-state-server/src/tool-handlers/update_item.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_item_handler(db: GameDatabase, args: any) {
  const { item_id, updates } = args;

  // --- VALIDATION FIX ---
  // The only parameters needed are the item's unique ID and the update payload.
  if (typeof item_id !== 'number' || !updates || typeof updates !== 'object') {
    return {
        content: ["❌ Invalid input: 'item_id' (number) and 'updates' (object) are required."].map(makeTextContent),
        isError: true
    };
  }
  // --- END FIX ---

  try {
    const result = await db.inventory.updateItem(item_id, updates);
    if (!result) {
      throw new Error(`Item with ID ${item_id} not found.`); // The repo now throws this, but we catch it.
    }
    return { content: [`✅ Updated item with ID ${item_id}.`].map(makeTextContent) };
  } catch (err: any) {
    return {
      content: [`❌ Failed to update item: ${err.message}`].map(makeTextContent),
      isError: true
    };
  }
}