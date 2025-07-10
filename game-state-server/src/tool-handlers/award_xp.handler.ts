import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function award_xp_handler(args: any) {
  const { character_id, amount, reason } = args;
  const db = new GameDatabase();
  const character = db.characters.getCharacterById(character_id);

  if (!character) {
    return { content: makeTextContentArray([`❌ Character with ID ${character_id} not found.`]), isError: true };
  }

  const newExperience = (character.experience || 0) + amount;
  db.characters.updateCharacter(character_id, { experience: newExperience });

  return { content: makeTextContentArray([`✅ Awarded ${amount} XP to ${character.name}. New total: ${newExperience}. Reason: ${reason || "No reason provided."}`]) };
}