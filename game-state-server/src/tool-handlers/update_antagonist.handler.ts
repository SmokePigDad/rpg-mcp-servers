import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function update_antagonist_handler(args: any) {
  const { antagonist_id, updates } = args;
  const db = new GameDatabase();
  const antagonist = await db.antagonists.updateAntagonist(antagonist_id, updates);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Antagonist with ID ${antagonist_id} not found.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Antagonist "${antagonist.name}" (ID: ${antagonist.id}) updated.`]) };
}