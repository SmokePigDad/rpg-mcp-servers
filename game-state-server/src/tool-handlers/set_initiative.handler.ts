import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function set_initiative_handler(db: GameDatabase, args: any) {
  const { scene_id, entries } = args;
  const success = db.worldState.setInitiative(scene_id, entries);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not set initiative for scene ${scene_id}.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Set initiative for scene ${scene_id}.`]) };
}