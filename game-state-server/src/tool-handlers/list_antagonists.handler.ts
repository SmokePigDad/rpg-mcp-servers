import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function list_antagonists_handler(args: any) {
  const db = new GameDatabase();
  const antagonists = db.antagonists.listAntagonists();

  const antagonistList = antagonists.map(antagonist => `${antagonist.name} (ID: ${antagonist.id})`).join('\n');

  return { content: makeTextContentArray([antagonistList || "No antagonists found."]) };
}