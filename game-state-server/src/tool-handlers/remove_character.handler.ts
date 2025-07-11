// File: game-state-server/src/tool-handlers/remove_character.handler.ts

import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function remove_character_handler(db: GameDatabase, args: any) {
  const { character_id } = args;

  if (typeof character_id !== 'number') {
    return { 
      content: makeTextContentArray(["❌ Invalid input: 'character_id' must be a number."]), 
      isError: true 
    };
  }
  
  try {
    const character = await db.characters.getCharacterById(character_id);
    if (!character) {
        return { 
            content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), 
            isError: true 
        };
    }
    
    const success = db.characters.removeCharacter(character_id);

    if (success) {
      return { 
        content: makeTextContentArray([`✅ Character '${character.name}' (ID: ${character_id}) and all associated data have been permanently removed.`])
      };
    } else {
      // This case should be rare if the getCharacterById check passed, but it's good practice.
      return { 
        content: makeTextContentArray([`❌ Failed to remove character with ID ${character_id}. They may have already been deleted.`]),
        isError: true 
      };
    }
  } catch (error: any) {
    console.error(`[remove_character_handler] Error:`, error);
    return { 
      content: makeTextContentArray([`❌ An unexpected error occurred while removing character: ${error.message}`]), 
      isError: true 
    };
  }
}