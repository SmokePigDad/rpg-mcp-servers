// File: game-state-server/src/tool-handlers/remove_character.handler.ts

import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function remove_character_handler(db: GameDatabase, args: any) {
  const { character_id } = args;

  if (typeof character_id !== 'number') {
    return { 
      content: ["❌ Invalid input: 'character_id' must be a number."].map(makeTextContent),
      isError: true 
    };
  }
  
  try {
    const character = await db.characters.getCharacterById(character_id);
    if (!character) {
        return { 
            content: [`❌ Character with ID ${character_id} not found.`].map(makeTextContent),
            isError: true 
        };
    }
    
    const success = db.characters.removeCharacter(character_id);

    if (success) {
      return { 
        content: [`✅ Character '${character.name}' (ID: ${character_id}) and all associated data have been permanently removed.`].map(makeTextContent)
      };
    } else {
      // This case should be rare if the getCharacterById check passed, but it's good practice.
      return { 
        content: [`❌ Failed to remove character with ID ${character_id}. They may have already been deleted.`].map(makeTextContent),
        isError: true 
      };
    }
  } catch (error: any) {
    console.error(`[remove_character_handler] Error:`, error);
    return { 
      content: [`❌ An unexpected error occurred while removing character: ${error.message}`].map(makeTextContent),
      isError: true 
    };
  }
}