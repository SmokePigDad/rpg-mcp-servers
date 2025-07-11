// game-state-server/src/tool-handlers/save_story_progress.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_story_progress_handler(db: GameDatabase, args: any) {
  if (
    !args ||
    args.chapter == null ||
    args.scene == null ||
    args.summary == null
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid input. 'chapter', 'scene', and 'summary' are required."
      ]),
      isError: true
    };
  }
  
  const { chapter, scene, summary } = args;

  try {
    db.worldState.saveStoryProgress({ chapter, scene, summary });
    return { content: makeTextContentArray([`📖 Story progress for Chapter ${chapter}, Scene ${scene} saved.`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Could not save story progress: ${error.message}`]), isError: true };
  }
}
