import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_status_effect_handler(args: any) {
  const { effect_id } = args;
  const db = new GameDatabase();
  const success = db.statusEffects.removeStatusEffect(effect_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove status effect with ID ${effect_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Removed status effect with ID ${effect_id}.`]) };
}