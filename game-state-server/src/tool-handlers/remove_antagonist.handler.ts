import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.antagonist_id !== 'number' ||
    Number.isNaN(args.antagonist_id)
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'antagonist_id': must be a valid number."
    ]), isError: true };
  }
  const { antagonist_id } = args;
  const success = await db.antagonists.removeAntagonist(antagonist_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove antagonist with ID ${antagonist_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Antagonist with ID ${antagonist_id} removed successfully.`]) };
}