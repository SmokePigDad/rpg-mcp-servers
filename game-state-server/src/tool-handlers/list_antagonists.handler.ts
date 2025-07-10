import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function list_antagonists_handler(
  db: GameDatabase,
  args: any
) {
  const antagonists = db.antagonists.listAntagonists();

  const antagonistList = antagonists.map(antagonist => `${antagonist.name} (ID: ${antagonist.id})`).join('\n');

  return { content: makeTextContentArray([antagonistList || "No antagonists found."]) };
}