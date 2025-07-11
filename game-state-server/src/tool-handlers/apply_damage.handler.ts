// game-state-server/src/tool-handlers/apply_damage.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContent } from '../index.js';

export async function apply_damage_handler(db: GameDatabase, args: any) {
  const { target_id, target_type, damage_successes, damage_type } = args;

  if (typeof target_id !== 'number' || !target_type) {
    return { content: ["❌ target_id and target_type are required."].map(makeTextContent), isError: true };
  }
  
  // THE FIX: Construct a DamageObject based on the input.
  const damage = {
    bashing: damage_type === 'bashing' ? damage_successes : 0,
    lethal: damage_type === 'lethal' ? damage_successes : 0,
    aggravated: damage_type === 'aggravated' ? damage_successes : 0,
  };

  const repository = target_type === 'character' ? db.characters : db.antagonists;
  const target = await repository.applyDamage(target_id, damage);
  
  if (!target) {
    return { content: [`❌ ${target_type} with ID ${target_id} not found.`].map(makeTextContent), isError: true };
  }
  
  return { content: [`💥 ${damage_successes} ${damage_type} damage applied to ${target.name}.`].map(makeTextContent) };
}