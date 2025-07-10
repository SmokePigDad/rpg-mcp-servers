// game-state-server/src/tool-handlers/get_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterHandlerArgs {
  character_id: number;
}

export async function get_character_handler(
  db: GameDatabase,
  args: GetCharacterHandlerArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id)
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing 'character_id'. Must provide a valid number."
      ]),
      isError: true
    };
  }
  try {
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([JSON.stringify(character, null, 2)]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_handler error:", error);
    return { content: makeTextContentArray([`❌ Error getting character: ${errMsg}`]), isError: true };
  }
}