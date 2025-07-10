import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function advance_turn_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  const success = db.advanceTurn(scene_id);
  return { content: makeTextContentArray([`✅ Advanced turn for scene ${scene_id}.`]) };
}