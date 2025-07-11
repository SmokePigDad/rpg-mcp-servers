// game-state-server/src/tool-handlers/update_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';
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
    console.log('[UPDATE_CHARACTER] Request:', args.character_id, args.updates);
    const character = await db.characters.updateCharacter(args.character_id, args.updates);
    if (!character) {
      console.warn('[UPDATE_CHARACTER] No character found for ID:', args.character_id);
      return { content: [`❌ Character with ID ${args.character_id} not found.`].map(makeTextContent), isError: true };
    }
    console.log('[UPDATE_CHARACTER] Update succeeded:', character.id, args.updates);
    return { content: [`Character "${character.name}" (ID ${character.id}) updated.`].map(makeTextContent) };
  } catch (error: unknown) {
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    if (errMsg && errMsg.includes('no such column')) {
      console.error('[UPDATE_CHARACTER] Attempted to update invalid field:', errMsg, args.updates);
      return {
        content: [
          `❌ Error: Tried to update a field that does not exist (${errMsg}). Check that the attribute is valid for this character type.`
        ].map(makeTextContent),
        isError: true
      };
    }
    console.error('[UPDATE_CHARACTER] Handler error:', error);
    return { content: [`❌ Error updating character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}