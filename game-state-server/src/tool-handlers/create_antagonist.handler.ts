import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function create_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.template_name !== 'string' ||
    args.template_name.trim().length === 0 ||
    (args.custom_name && typeof args.custom_name !== 'string')
  ) {
    return { content: [
      "❌ Invalid or missing arguments: 'template_name' must be a non-empty string, and 'custom_name' (if provided) must be a string."
    ].map(makeTextContent), isError: true };
  }
  const { template_name, custom_name } = args;

  const antagonist = db.antagonists.createAntagonist(template_name, custom_name);

  if (!antagonist) {
    return { content: [`❌ Error creating antagonist from template: ${template_name}`].map(makeTextContent), isError: true };
  }

  return { content: [`Antagonist \"${antagonist.name}\" created (ID: ${antagonist.id})`].map(makeTextContent) };
}