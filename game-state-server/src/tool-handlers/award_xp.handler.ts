import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function award_xp_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== 'number' ||
    Number.isNaN(args.character_id) ||
    typeof args.amount !== 'number' ||
    Number.isNaN(args.amount)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' and 'amount' must be valid numbers."
    ]), isError: true };
  }

  const { character_id, amount, reason } = args;

  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  const newExperience = (character.experience || 0) + amount;
  db.characters.updateCharacter(character_id, { experience: newExperience });

  return { content: makeTextContentArray([`✅ Awarded ${amount} XP to ${character.name}. New total: ${newExperience}. Reason: ${typeof reason === "string" && reason.trim().length > 0 ? reason : "No reason provided."}`]) };
}