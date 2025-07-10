// game-state-server/src/tool-handlers/update_character.handler.ts
import { GameDatabase } from '../db.js';

export async function update_character_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: `Character "${character.name}" (ID ${character.id}) updated.` }] };
  } catch (error: any) {
    console.error("update_character_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error updating character: ${error.message}` }], isError: true };
  }
}