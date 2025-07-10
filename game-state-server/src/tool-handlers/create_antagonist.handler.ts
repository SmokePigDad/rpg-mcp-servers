import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function create_antagonist_handler(db: GameDatabase, args: any) {
  const { template_name, custom_name } = args;
  const antagonist = db.antagonists.createAntagonist(template_name, custom_name);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Error creating antagonist from template: ${template_name}`]), isError: true };
  }

  return { content: makeTextContentArray([`Antagonist "${antagonist.name}" created (ID: ${antagonist.id})`]) };
}