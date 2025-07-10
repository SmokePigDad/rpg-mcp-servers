import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_initiative_order_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, "scene_id") ||
    (typeof args.scene_id !== "string" && typeof args.scene_id !== "number")
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing 'scene_id'. Must provide a string or number."
      ]),
      isError: true
    };
  }
  const { scene_id } = args;
  const initiativeOrder = db.worldState.getInitiativeOrder(scene_id);
  return { content: makeTextContentArray([JSON.stringify(initiativeOrder, null, 2)]) };
}