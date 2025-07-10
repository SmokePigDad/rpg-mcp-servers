import { makeTextContentArray } from '../index.js';
export async function list_antagonists_handler({ antagonistRepository }, args: any) {
  const antagonists = antagonistRepository.listAntagonists();

  const antagonistList = antagonists.map(antagonist => `${antagonist.name} (ID: ${antagonist.id})`).join('\n');

  return { content: makeTextContentArray([antagonistList || "No antagonists found."]) };
}