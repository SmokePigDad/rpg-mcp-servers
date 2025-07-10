import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function save_story_progress_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    !Object.prototype.hasOwnProperty.call(args, 'story_progress') ||
    !Object.prototype.hasOwnProperty.call(args, 'character_id')
  ) {
    return {
      content: makeTextContentArray([
        "❌ Invalid or missing arguments: both 'character_id' and 'story_progress' are required."
      ]),
      isError: true
    };
  }
  const { character_id, story_progress } = args;

  try {
    db.worldState.saveStoryProgress(character_id, story_progress);
    return { content: makeTextContentArray([`✅ Story progress saved successfully.`]) };
  } catch (error: any) {
    return {
      content: makeTextContentArray([`❌ Could not save story progress: ${error.message || error}`]),
      isError: true
    };
  }
}