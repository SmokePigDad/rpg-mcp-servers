import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function save_world_state_handler(args: any) {
  const { world_state } = args;
    const db = new GameDatabase();
    const success = db.saveWorldState(world_state);
  
    if (!success) {
      return { content: makeTextContentArray([`❌ Could not save world state.`]), isError: true };
    }
  
    return { content: makeTextContentArray([`✅ World state saved successfully.`]) };
  }