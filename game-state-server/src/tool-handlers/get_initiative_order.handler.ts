import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function get_initiative_order_handler(args: any) {
  const { scene_id } = args;
    const db = new GameDatabase();
  const initiativeOrder = db.getInitiativeOrder(scene_id);
  return { content: makeTextContentArray([JSON.stringify(initiativeOrder, null, 2)]) };
}