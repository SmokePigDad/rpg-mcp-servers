// game-state-server/src/tool-handlers/get_character_by_name.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterByNameHandlerArgs {
  name: string;
}

export async function get_character_by_name_handler(
  db: GameDatabase,
  args: GetCharacterByNameHandlerArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.name !== "string" ||
    args.name.trim().length === 0
  ) {
    return {
      content: [
        "❌ Invalid or missing 'name'. A non-empty string is required."
      ].map(makeTextContent),
      isError: true
    };
  }
  try {
    const character = await db.characters.getCharacterByName(args.name);
    if (!character) {
      return { content: [`❌ Character with name ${args.name} not found.`].map(makeTextContent), isError: true };
    }
    return { content: [JSON.stringify(character, null, 2)].map(makeTextContent) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_by_name_handler error:", error);
    return { content: [`❌ Error getting character: ${errMsg}`].map(makeTextContent), isError: true };
  }
}