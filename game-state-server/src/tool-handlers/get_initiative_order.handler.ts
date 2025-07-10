import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_initiative_order_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  // TODO: Implement getting initiative order logic
  return { content: makeTextContentArray([`Tool get_initiative_order is not yet fully implemented.`]) };
}