import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_antagonist_handler(args: any) {
  const { antagonist_id } = args;
  const db = new GameDatabase();
  const antagonist = db.antagonists.getAntagonistById(antagonist_id);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Antagonist with ID ${antagonist_id} not found.`]), isError: true };
  }

  return { content: makeTextContentArray([JSON.stringify(antagonist, null, 2)]) };
}