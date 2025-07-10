import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function apply_status_effect_handler(
  db: GameDatabase,
  args: any
) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== 'string' ||
    (args.target_type !== 'character' && args.target_type !== 'npc') ||
    !Object.prototype.hasOwnProperty.call(args, 'target_id') ||
    typeof args.target_id !== 'number' ||
    Number.isNaN(args.target_id) ||
    typeof args.effect_name !== 'string' ||
    args.effect_name.trim().length === 0
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments. 'target_type' must be 'character' or 'npc', 'target_id' must be a valid number, 'effect_name' must be a non-empty string."
    ]), isError: true };
  }
  const { target_type, target_id, effect_name, description, mechanical_effect, duration_type, duration_value } = args;

  const effectId = db.statusEffects.addStatusEffect({
    target_type,
    target_id,
    effect_name,
    description,
    mechanical_effect,
    duration_type,
    duration_value,
  });

  return { content: makeTextContentArray([`✅ Applied status effect \"${effect_name}\" (ID: ${effectId}) to ${target_type} with ID ${target_id}.`]) };
}