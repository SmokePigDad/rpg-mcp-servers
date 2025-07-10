// game-state-server/src/tool-handlers/create_character.handler.ts
import { GameDatabase } from '../db.js';

export async function create_character_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    const character = await db.characters.createCharacter(args);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Error creating character: Character not found after creation.` }], isError: true };
    }
    return { content: [{ type: 'text', text: `Character "${character.name}" created with ID ${character.id}` }] };
  } catch (error: any) {
    console.error("create_character_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error creating character: ${error.message}` }], isError: true };
  }
}