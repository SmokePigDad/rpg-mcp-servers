// game-state-server/src/tool-handlers/get_character_by_name.handler.ts
import { GameDatabase } from '../db.js';

export async function get_character_by_name_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    const character = await db.characters.getCharacterByName(args.name);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with name ${args.name} not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: JSON.stringify(character, null, 2) }] };
  } catch (error: any) {
    console.error("get_character_by_name_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error getting character: ${error.message}` }], isError: true };
  }
}