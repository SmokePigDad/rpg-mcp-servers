import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function get_world_state_handler(db: GameDatabase, args: any) {
  const worldState = db.worldState.getWorldState();
  return { content: [JSON.stringify(worldState, null, 2)].map(makeTextContent) };
}