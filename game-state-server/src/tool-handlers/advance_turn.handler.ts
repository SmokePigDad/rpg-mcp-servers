import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function advance_turn_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  // TODO: Implement advancing turn logic
  return { content: makeTextContentArray([`Tool advance_turn is not yet fully implemented.`]) };
}