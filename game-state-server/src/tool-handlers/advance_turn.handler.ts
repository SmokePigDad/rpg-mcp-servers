import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function advance_turn_handler(db: GameDatabase, args: any) {
  const { scene_id } = args;
  const success = db.worldState.advanceTurn(scene_id);
  return { content: makeTextContentArray([`✅ Advanced turn for scene ${scene_id}.`]) };
}