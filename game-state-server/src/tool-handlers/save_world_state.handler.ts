import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_world_state_handler(db: GameDatabase, args: any) {
  // Add robust input validation
  if (!args || (args.location == null && args.notes == null && args.data == null)) {
    return { 
      content: ["❌ Invalid input. At least one of 'location', 'notes', or 'data' must be provided."].map(makeTextContent),
      isError: true 
    };
  }

  const { location, notes, data } = args;
  
  try {
    // The repository method is correct, the handler just needed to pass the args.
    db.worldState.saveWorldState({ location, notes, data });
    return { content: [`🌍 World state saved successfully.`].map(makeTextContent) };
  } catch (err: any) {
    return { content: [`❌ Could not save world state: ${err.message}`].map(makeTextContent), isError: true };
  }
}
