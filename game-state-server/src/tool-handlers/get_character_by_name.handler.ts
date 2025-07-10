// game-state-server/src/tool-handlers/get_character_by_name.handler.ts
import { GameDatabase } from '../db.js';
import { makeTextContentArray } from '../index.js';

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export interface GetCharacterByNameHandlerArgs {
  name: string;
}

export async function get_character_by_name_handler(
  db: GameDatabase,
  args: GetCharacterByNameHandlerArgs
): Promise<HandlerResponse> {
  try {
    const character = await db.characters.getCharacterByName(args.name);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with name ${args.name} not found.`]), isError: true };
    }
    return { content: makeTextContentArray([JSON.stringify(character, null, 2)]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_by_name_handler error:", error);
    return { content: makeTextContentArray([`❌ Error getting character: ${errMsg}`]), isError: true };
  }
}