// game-state-server/src/tool-handlers/get_character.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';
import { CharacterService } from '../services/character.service.js';
import { formatSheetByGameLine } from '../characterSheets.js';

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
      content: [
        "❌ Invalid or missing 'character_id'. Must provide a valid number."
      ].map(makeTextContent),
      isError: true
    };
  }
  
  // The service abstracts away the repository details
  const characterService = new CharacterService(db.characters);

  try {
    const character = await characterService.getCharacter(args.character_id);
    // The formatting logic can be moved into a dedicated formatter function
    const sheet = formatSheetByGameLine({ character }); // Assuming you have this function
    return { content: [sheet] };
  } catch (error: any) {
    return { content: [`❌ ${error.message}`].map(makeTextContent), isError: true };
  }
}
