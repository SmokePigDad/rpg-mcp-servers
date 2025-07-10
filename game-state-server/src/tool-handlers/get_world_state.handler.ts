import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_world_state_handler(args: any) {
    const db = new GameDatabase();
  const worldState = db.getWorldState();
  return { content: makeTextContentArray([JSON.stringify(worldState, null, 2)]) };
}