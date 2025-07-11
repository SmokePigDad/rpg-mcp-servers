import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function update_antagonist_handler(db: GameDatabase, args: any) {
  const { antagonist_id, updates } = args;
  const antagonist = await db.antagonists.updateAntagonist(antagonist_id, updates);

  if (!antagonist) {
    return { content: [`❌ Antagonist with ID ${antagonist_id} not found.`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Antagonist "${antagonist.name}" (ID: ${antagonist.id}) updated.`].map(makeTextContent) };
}