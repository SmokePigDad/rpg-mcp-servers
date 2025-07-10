import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_current_turn_handler(db: GameDatabase, args: any) {
  const { scene_id } = args;
  const currentTurn = db.worldState.getCurrentTurn(scene_id);
  return { content: makeTextContentArray([JSON.stringify(currentTurn, null, 2)]) };
}