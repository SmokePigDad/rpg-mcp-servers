import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_status_effect_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.effect_id !== 'number' ||
    Number.isNaN(args.effect_id)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'effect_id': must be a valid number."
    ]), isError: true };
  }
  const { effect_id } = args;
  const success = db.statusEffects.removeStatusEffect(effect_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove status effect with ID ${effect_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Removed status effect with ID ${effect_id}.`]) };
}