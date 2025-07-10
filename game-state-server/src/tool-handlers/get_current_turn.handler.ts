import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_current_turn_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  const currentTurn = db.getCurrentTurn(scene_id);
  return { content: makeTextContentArray([JSON.stringify(currentTurn, null, 2)]) };
}