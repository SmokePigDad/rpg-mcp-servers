import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function batch_improve_antagonist_traits_handler(db: GameDatabase, args: any) {
  const { antagonist_id, improvements } = args;

  if (!antagonist_id || !Array.isArray(improvements) || improvements.length === 0) {
    return { 
      content: ["❌ Invalid input: 'antagonist_id' and a non-empty 'improvements' array are required."].map(makeTextContent),
      isError: true 
    };
  }

  try {
    const result = db.antagonists.batchImproveAntagonistTraits(antagonist_id, improvements);
    const antagonist = db.antagonists.getAntagonistById(antagonist_id);
    const output = `🌟 Antagonist '${antagonist?.name}' Traits Improved!\n\n${result.summary}\n\nRemaining XP: ${result.final_xp}`;
    return { content: [output].map(makeTextContent) };
  } catch (error: any) {
    return { content: [`❌ Error improving antagonist traits: ${error.message}`].map(makeTextContent), isError: true };
  }
}