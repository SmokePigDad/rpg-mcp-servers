import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_inventory_handler(db: GameDatabase, args: any) {
    const { character_id } = args;
    if (typeof character_id !== 'number') {
        return { content: ["❌ Invalid 'character_id'."].map(makeTextContent), isError: true };
    }
    const inventory = db.inventory.getInventory(character_id);
    const output = `🎒 Inventory for Character #${character_id}:\n` +
        (inventory.length > 0
        ? inventory.map((item: any) => `- ${item.item_name} (x${item.quantity}) [ID: ${item.id}]`).join('\n')
        : '  (Empty)');
    return { content: [output].map(makeTextContent) };
}