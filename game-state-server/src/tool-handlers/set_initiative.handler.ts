import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function set_initiative_handler(db: GameDatabase, args: any) {
  const { scene_id, entries } = args;
  try {
    db.worldState.setInitiative(scene_id, entries);
  } catch (err) {
    const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    return { content: [`❌ Could not set initiative for scene ${scene_id}: ${errorMsg}`].map(makeTextContent), isError: true };
  }

  return { content: [`✅ Set initiative for scene ${scene_id}.`].map(makeTextContent) };
}