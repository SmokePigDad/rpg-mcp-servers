import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function create_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.template_name !== 'string' ||
    args.template_name.trim().length === 0 ||
    (args.custom_name && typeof args.custom_name !== 'string')
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'template_name' must be a non-empty string, and 'custom_name' (if provided) must be a string."
    ]), isError: true };
  }
  const { template_name, custom_name } = args;

  const antagonist = db.antagonists.createAntagonist(template_name, custom_name);

  if (!antagonist) {
    return { content: makeTextContentArray([`❌ Error creating antagonist from template: ${template_name}`]), isError: true };
  }

  return { content: makeTextContentArray([`Antagonist \"${antagonist.name}\" created (ID: ${antagonist.id})`]) };
}