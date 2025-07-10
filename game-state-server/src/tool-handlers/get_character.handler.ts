// game-state-server/src/tool-handlers/get_character.handler.ts
import { GameDatabase } from '../db.js';

export async function get_character_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: JSON.stringify(character, null, 2) }] };
  } catch (error: any) {
    console.error("get_character_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error getting character: ${error.message}` }], isError: true };
  }
}