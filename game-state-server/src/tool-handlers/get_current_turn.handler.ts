import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_current_turn_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: [
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ].map(makeTextContent),
      isError: true
    };
  }
  const { scene_id } = args;
  const currentTurn = db.worldState.getCurrentTurn(scene_id);
  return { content: [JSON.stringify(currentTurn, null, 2)].map(makeTextContent) };
}