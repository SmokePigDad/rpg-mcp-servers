import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function advance_turn_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'scene_id') ||
    (typeof args.scene_id !== 'string' && typeof args.scene_id !== 'number')
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing 'scene_id'. Must provide a scene_id as a string or number."
    ]), isError: true };
  }

  const { scene_id } = args;
  db.worldState.advanceTurn(scene_id);
  return { content: makeTextContentArray([`✅ Advanced turn for scene ${scene_id}.`]) };
}