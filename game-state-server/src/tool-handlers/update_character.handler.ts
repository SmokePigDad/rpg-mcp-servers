// game-state-server/src/tool-handlers/update_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';
import type { CharacterData } from '../types/character.types.js';

export interface UpdateCharacterHandlerArgs {
  character_id: number;
  updates: Partial<CharacterData>;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function update_character_handler(
  db: GameDatabase,
  args: UpdateCharacterHandlerArgs
): Promise<HandlerResponse> {
  try {
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([`Character "${character.name}" (ID ${character.id}) updated.`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for 'error'
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("update_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error updating character: ${errMsg}`]), isError: true };
  }
}