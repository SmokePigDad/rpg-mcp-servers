import { makeTextContentArray } from '../index.js';
import { GameDatabase } from '../db.js';

export async function save_story_progress_handler(args: any) {
  const { story_progress } = args;
  const db = new GameDatabase();
  const success = db.saveStoryProgress(story_progress);

  if (!success) {
    return { content: makeTextContentArray([`❌ Could not save story progress.`]), isError: true };
  }

  return { content: makeTextContentArray([`✅ Story progress saved successfully.`]) };
}