// game-state-server/src/tool-handlers/get_character.handler.ts
import { GameDatabase } from '../db.js';
import { makeTextContentArray } from '../index.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterHandlerArgs {
  character_id: number;
}

export async function get_character_handler(
  args: GetCharacterHandlerArgs
): Promise<HandlerResponse> {
  try {
    const db = new GameDatabase();
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