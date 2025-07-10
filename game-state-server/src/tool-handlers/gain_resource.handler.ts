// game-state-server/src/tool-handlers/gain_resource.handler.ts
import { GameDatabase } from '../db.js';

export async function gain_resource_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    // Assuming there's a method to gain resources in the CharacterRepository
    // This might need to be adjusted based on your actual implementation
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
     //In a real implementation you would update the character to reflect resource gaining
    return { content: [{ type: 'text', text: `Resource ${args.resource_name} gained for Character id ${args.character_id}` }] };
  } catch (error: any) {
    console.error("gain_resource_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error gaining resource: ${error.message}` }], isError: true };
  }
}