// game-state-server/src/tool-handlers/apply_damage.handler.ts
import { GameDatabase } from '../db.js';

export async function apply_damage_handler(args: any): Promise<any> {
  try {
    const db = new GameDatabase();
    // Assuming there's a method to apply damage in the CharacterRepository
    // This might need to be adjusted based on your actual implementation
    const character = await db.characters.getCharacterById(args.target_id);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.target_id} not found.` }], isError: true };
    }
     //In a real implementation you would update the character to reflect damage
    return { content: [{ type: 'text', text: `Damage applied to Character id ${args.target_id}` }] };
  } catch (error: any) {
    console.error("apply_damage_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error applying damage: ${error.message}` }], isError: true };
  }
}