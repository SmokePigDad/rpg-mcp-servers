// game-state-server/src/tool-handlers/create_character.handler.ts
import { GameDatabase } from '../db.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

/**
 * Creates a new character from the provided arg fields.
 * args: Opaque; expected to match CharacterData fields.
 * TODO: Specify arg type if possible.
 */
export async function create_character_handler(
  db: GameDatabase,
  args: Record<string, unknown> // TODO: Specify correct type
): Promise<HandlerResponse> {
  try {
    const character = await db.characters.createCharacter(args);
    if (!character) {
      return { content: makeTextContentArray([`❌ Error creating character: Character not found after creation.`]), isError: true };
    }
    return { content: makeTextContentArray([`Character "${character.name}" created with ID ${character.id}`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("create_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error creating character: ${errMsg}`]), isError: true };
  }
}