// game-state-server/src/tool-handlers/create_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

/**
 * Creates a new character from the provided arg fields.
 * args: Opaque; expected to match CharacterData fields.
 * TODO: Specify arg type if possible.
 */
export async function create_character_handler(
  db: GameDatabase,
  args: Record<string, unknown>
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.name !== 'string' ||
    args.name.trim().length === 0 ||
    typeof args.game_line !== 'string' ||
    args.game_line.trim().length === 0 ||
    !['vampire', 'werewolf', 'mage', 'changeling'].includes(args.game_line as string)
  ) {
    return { content: [
      "❌ Invalid or missing arguments: 'name' must be a non-empty string and 'game_line' must be one of: vampire, werewolf, mage, changeling."
    ].map(makeTextContent), isError: true };
  }
  try {
    console.log('[CREATE_CHARACTER] Input args:', args);
    // Check uniqueness for name
    const existing = await db.characters.getCharacterByName?.(args.name);
    if (existing) {
      console.warn('[CREATE_CHARACTER] Duplicate name detected:', args.name);
      return {
        content: [
          `❌ Duplicate character name "${args.name}" is not allowed.`
        ].map(makeTextContent),
        isError: true
      };
    }
    const character = await db.characters.createCharacter(args);
    if (!character) {
      return { content: [`❌ Error creating character: Character not found after creation.`].map(makeTextContent), isError: true };
    }
    return { content: [`Character \"${character.name}\" created with ID ${character.id}`].map(makeTextContent) };
  } catch (error: unknown) {
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("[CREATE_CHARACTER] Handler error:", error);
    return { content: [`❌ Error creating character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}