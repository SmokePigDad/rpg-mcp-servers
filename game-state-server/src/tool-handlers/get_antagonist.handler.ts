import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_antagonist_handler(db: GameDatabase, args: any) {
  // Validate input
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "antagonist_id") ||
    (typeof args.antagonist_id !== "string" && typeof args.antagonist_id !== "number")
  ) {
    return {
      content: [
        "❌ Invalid or missing 'antagonist_id'. It must be a string or number."
      ].map(makeTextContent),
      isError: true
    };
  }

  const { antagonist_id } = args;
  const antagonist = db.antagonists.getAntagonistById(antagonist_id);

  if (!antagonist) {
    return { content: [`❌ Antagonist with ID ${antagonist_id} not found.`].map(makeTextContent), isError: true };
  }

  return { content: [JSON.stringify(antagonist, null, 2)].map(makeTextContent) };
}