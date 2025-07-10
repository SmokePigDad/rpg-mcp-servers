// game-state-server/src/tool-handlers/update_character.handler.ts
import { GameDatabase } from '../db.js';
import type { CharacterData } from '../types/character.types.js';

export interface UpdateCharacterHandlerArgs {
  character_id: number;
  updates: Partial<CharacterData>;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function update_character_handler(
  args: UpdateCharacterHandlerArgs
): Promise<HandlerResponse> {
  try {
    const db = new GameDatabase();
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: `Character "${character.name}" (ID ${character.id}) updated.` }] };
  } catch (error: unknown) {
    // TODO: Specify correct type for 'error'
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("update_character_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error updating character: ${errMsg}` }], isError: true };
  }
}