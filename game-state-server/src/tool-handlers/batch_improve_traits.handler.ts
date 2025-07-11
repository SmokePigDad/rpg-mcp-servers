import type { GameDatabase } from '../types/db.types.js';

export async function batch_improve_traits_handler(db: GameDatabase, input: any) {
  const { character_id, improvements } = input;
  if (typeof character_id !== 'number' || !Array.isArray(improvements)) {
    throw new Error('Invalid input for batch_improve_traits');
  }
  const result = db.characters.batchImproveTraits(character_id, improvements);
  return result;
}