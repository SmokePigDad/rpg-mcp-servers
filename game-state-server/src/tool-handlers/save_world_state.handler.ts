import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_world_state_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'world_state')
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments: 'world_state' is required."
      ]),
      isError: true
    };
  }
  const { world_state } = args;
  try {
    db.worldState.saveWorldState(world_state);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: makeTextContentArray([`❌ Could not save world state: ${errorMsg}`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ World state saved successfully.`]) };
}