// game-state-server/src/tool-handlers/get_trait_improvement_cost.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

// Re-use the same logic from the improve_trait handler for consistency.
function calculateXpCost(trait_type: string, current_rating: number): number {
    const new_rating = current_rating + 1;
    switch (trait_type) {
        case 'attribute': return new_rating * 4;
        case 'ability': return new_rating * 2;
        case 'discipline': return new_rating * 5;
        case 'art': return new_rating * 4;
        case 'willpower': return current_rating; // Cost is current rating
        default: return 999; // Default for unknown
    }
}

export async function get_trait_improvement_cost_handler(db: GameDatabase, args: any) {
  const { character_id, trait_type, trait_name } = args;
  
  const character = await db.characters.getCharacterById(character_id);
  if (!character) return { content: [`❌ Character not found.`].map(makeTextContent), isError: true };

  // This logic is simplified; a full implementation would check relational tables too.
  const current_rating = (character as any)[trait_name.toLowerCase()] ?? 0;
  
  const cost = calculateXpCost(trait_type, current_rating);

  return { content: [`Cost to improve ${trait_name} from ${current_rating} to ${current_rating + 1} is ${cost} XP.`].map(makeTextContent) };
}