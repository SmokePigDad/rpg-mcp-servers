import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_current_turn_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  // TODO: Implement getting current turn logic
  return { content: makeTextContentArray([`Tool get_current_turn is not yet fully implemented.`]) };
}