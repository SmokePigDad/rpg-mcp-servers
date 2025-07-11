import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function award_xp_handler(db: GameDatabase, args: any) {
  // --- Input Validation ---
  if (
    !args ||
    typeof args.target_id !== 'number' ||
    !['character', 'antagonist'].includes(args.target_type) ||
    typeof args.amount !== 'number' || args.amount <= 0 ||
    typeof args.reason !== 'string'
  ) {
    return { 
      content: ["❌ Invalid arguments. Requires 'target_id', 'target_type' ('character' or 'antagonist'), a positive 'amount', and a 'reason'."].map(makeTextContent),
      isError: true
    };
  }

  const { target_id, target_type, amount, reason } = args;

  try {
    let target: any;
    let newExperience: number;

    if (target_type === 'character') {
      target = await db.characters.getCharacterById(target_id);
      if (!target) {
        throw new Error(`Character with ID ${target_id} not found.`);
      }
      newExperience = (target.experience || 0) + amount;
      await db.characters.updateCharacter(target_id, { experience: newExperience });
    } else { // target_type is 'antagonist'
      target = await db.antagonists.getAntagonistById(target_id);
      if (!target) {
        throw new Error(`Antagonist with ID ${target_id} not found.`);
      }
      newExperience = (target.experience || 0) + amount;
      await db.antagonists.updateAntagonist(target_id, { experience: newExperience });
    }

    const output = `✅ Awarded ${amount} XP to ${target.name} (${target_type}).\nNew total: ${newExperience}.\nReason: ${reason}`;
    return { content: [output].map(makeTextContent) };

  } catch (error: any) {
    return { 
      content: [`❌ Error awarding XP: ${error.message}`].map(makeTextContent),
      isError: true
    };
  }
}