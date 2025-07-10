import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_world_state_handler(db: GameDatabase, args: any) {
  const worldState = db.worldState.getWorldState();
  return { content: makeTextContentArray([JSON.stringify(worldState, null, 2)]) };
}