import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_status_effects_handler(db: GameDatabase, args: any) {
  const { target_type, target_id } = args;
  const effects = db.statusEffects.listStatusEffects(target_type, target_id);

  const effectList = effects.map(effect => `${effect.effect_name} (ID: ${effect.id})`).join('\n');

  return { content: makeTextContentArray([effectList || `No status effects found for ${target_type} with ID ${target_id}.`]) };
}