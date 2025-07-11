import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_status_effect_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.effect_id !== 'number' ||
    Number.isNaN(args.effect_id)
  ) {
    return { content: [
      "❌ Invalid or missing 'effect_id': must be a valid number."
    ].map(makeTextContent), isError: true };
  }
  const { effect_id } = args;
  const success = db.statusEffects.removeStatusEffect(effect_id);

  if (!success) {
    return { content: [`❌ Could not remove status effect with ID ${effect_id}.`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Removed status effect with ID ${effect_id}.`].map(makeTextContent) };
}