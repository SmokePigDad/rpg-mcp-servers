import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function save_world_state_handler(db: GameDatabase, args: any) {
  const { world_state } = args;
  const success = db.worldState.saveWorldState(world_state);
  
  if (!success) {
    return { content: makeTextContentArray([`❌ Could not save world state.`]), isError: true };
    }
  
  return { content: makeTextContentArray([`✅ World state saved successfully.`]) };
  }