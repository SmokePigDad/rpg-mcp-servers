import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function remove_antagonist_handler(args: any) {
  const { antagonist_id } = args;
  const db = new GameDatabase();
  const success = await db.antagonists.removeAntagonist(antagonist_id);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not remove antagonist with ID ${antagonist_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Antagonist with ID ${antagonist_id} removed successfully.`]) };
}