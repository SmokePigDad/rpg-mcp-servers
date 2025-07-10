import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function apply_status_effect_handler(db: GameDatabase, args: any) {
  const { target_type, target_id, effect_name, description, mechanical_effect, duration_type, duration_value } = args;
  const effectId = db.statusEffects.addStatusEffect({ target_type, target_id, effect_name, description, mechanical_effect, duration_type, duration_value });

  return { content: makeTextContentArray([`✅ Applied status effect "${effect_name}" (ID: ${effectId}) to ${target_type} with ID ${target_id}.`]) };
}