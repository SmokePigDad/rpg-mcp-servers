import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function set_initiative_handler(db: GameDatabase, args: any) {
  const { scene_id, entries } = args;
  try {
    db.worldState.setInitiative(scene_id, entries);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: makeTextContentArray([`❌ Could not set initiative for scene ${scene_id}: ${errorMsg}`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Set initiative for scene ${scene_id}.`]) };
}