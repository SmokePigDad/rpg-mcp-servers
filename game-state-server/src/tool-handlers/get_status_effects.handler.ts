import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_status_effects_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.target_type !== "string" ||
    args.target_type.trim().length === 0 ||
    !Object.prototype.hasOwnProperty.call(args, "target_id") ||
    typeof args.target_id !== "number" ||
    Number.isNaN(args.target_id)
  ) {
    return {
      content: [
        "❌ Invalid or missing arguments. 'target_type' must be a non-empty string, 'target_id' must be a valid number."
      ].map(makeTextContent),
      isError: true
    };
  }
  const { target_type, target_id } = args;
  const effects = db.statusEffects.listStatusEffects(target_type, target_id);

  const effectList = effects.map(effect => `${effect.effect_name} (ID: ${effect.id})`).join('\n');

  return { content: [effectList || `No status effects found for ${target_type} with ID ${target_id}.`].map(makeTextContent) };
}