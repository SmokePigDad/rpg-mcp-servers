// game-state-server/src/tool-handlers/spend_resource.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function spend_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, amount = 1 } = args;
  if (typeof character_id !== 'number' || typeof resource_name !== 'string' || typeof amount !== 'number' || amount < 1) {
    return { content: makeTextContentArray(["❌ Invalid arguments."]), isError: true };
  }

  const character = db.characters.getCharacterById(character_id);
  if (!character) return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  
  let updates: Record<string, any> = {};
  let currentValue: number;

  if (resource_name.startsWith('willpower')) {
      currentValue = character.willpower_current;
      if(currentValue < amount) return { content: makeTextContentArray([`❌ Not enough Willpower. Has ${currentValue}, needs ${amount}.`]), isError: true };
      updates.willpower_current = currentValue - amount;
  } else if (resource_name.startsWith('blood') && character.game_line === 'vampire') {
      currentValue = character.blood_pool_current;
      if(currentValue < amount) return { content: makeTextContentArray([`❌ Not enough Blood. Has ${currentValue}, needs ${amount}.`]), isError: true };
      updates.blood_pool_current = currentValue - amount;
  } else if (resource_name.startsWith('rage') && character.game_line === 'werewolf') {
      currentValue = character.rage_current;
      if(currentValue < amount) return { content: makeTextContentArray([`❌ Not enough Rage. Has ${currentValue}, needs ${amount}.`]), isError: true };
      updates.rage_current = currentValue - amount;
  } else {
    return { content: makeTextContentArray([`❌ Invalid or inapplicable resource '${resource_name}' for this character.`]), isError: true };
  }
  
  await db.characters.updateCharacter(character_id, updates);
  const updatedChar = db.characters.getCharacterById(character_id);
  
  return { content: makeTextContentArray([`✅ ${character.name} spent ${amount} ${resource_name.split('_')[0]}. New total: ${updatedChar ? updatedChar[resource_name] : 'N/A'}`]) };
}