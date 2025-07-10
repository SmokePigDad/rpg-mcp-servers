// game-state-server/src/tool-handlers/get_character.handler.ts
import { GameDatabase } from '../db.js';

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
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: JSON.stringify(character, null, 2) }] };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("get_character_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error getting character: ${errMsg}` }], isError: true };
  }
}