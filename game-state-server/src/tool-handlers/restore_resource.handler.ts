// game-state-server/src/tool-handlers/restore_resource.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function restore_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, amount = 1 } = args;
  
  const character = await db.characters.getCharacterById(character_id);
  if (!character) return { content: makeTextContentArray([`❌ Character not found.`]), isError: true };

  const resourceMap: Record<string, { current: string, max: string }> = {
    willpower: { current: 'willpower_current', max: 'willpower_permanent' },
    blood: { current: 'blood_pool_current', max: 'blood_pool_max' },
    gnosis: { current: 'gnosis_current', max: 'gnosis_permanent' },
    rage: { current: 'rage_current', max: 'rage_permanent' },
    glamour: { current: 'glamour_current', max: 'glamour_permanent' }
  };
  
  const res = resourceMap[resource_name];
  if (!res) return { content: makeTextContentArray([`❌ Invalid resource '${resource_name}'.`]), isError: true };
  
  const currentValue = (character as any)[res.current] ?? 0;
  const maxValue = (character as any)[res.max] ?? currentValue;
  
  const newValue = Math.min(maxValue, currentValue + amount);
  
  await db.characters.updateCharacter(character_id, { [res.current]: newValue });
  const updatedChar = await db.characters.getCharacterById(character_id);

  const newTotal = updatedChar ? (updatedChar as any)[res.current] : 'N/A';
  return { content: makeTextContentArray([`✅ ${character.name} restored ${amount} ${resource_name}. New total: ${newTotal}/${maxValue}`]) };
}