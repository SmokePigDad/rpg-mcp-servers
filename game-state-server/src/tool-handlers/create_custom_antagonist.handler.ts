import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function create_custom_antagonist_handler(db: GameDatabase, args: any) {
  if (!args.name || !args.game_line) {
    return { 
      content: ["❌ Invalid input: 'name' and 'game_line' are required to create a custom antagonist."].map(makeTextContent),
      isError: true 
    };
  }

  try {
    const antagonist = db.antagonists.createCustomAntagonist(args);
    if (!antagonist) {
        throw new Error("Database failed to create the antagonist.");
    }
    const output = `✅ Custom antagonist '${antagonist.name}' (ID: ${antagonist.id}) has been created with the specified traits.`;
    return { content: [output].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error creating custom antagonist: ${error.message}`].map(makeTextContent), isError: true };
  }
}