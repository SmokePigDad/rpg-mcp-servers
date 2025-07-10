import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function save_story_progress_handler(db: GameDatabase, args: any) {
  // Add robust input validation
  if (!args || args.chapter == null || args.scene == null || args.summary == null) {
    return {
      content: makeTextContentArray(["❌ Invalid input. 'chapter', 'scene', and 'summary' are required."]),
      isError: true
    };
  }
  
  const { character_id, chapter, scene, summary } = args; // character_id is also needed

  try {
    // The repository method expects character_id and a progress object
    db.worldState.saveStoryProgress(character_id, { chapter, scene, summary });
    return { content: makeTextContentArray([`📖 Story progress for Chapter ${chapter} saved.`]) };
  } catch (error: any) {
    return { content: makeTextContentArray([`❌ Could not save story progress: ${error.message}`]), isError: true };
  }
}
