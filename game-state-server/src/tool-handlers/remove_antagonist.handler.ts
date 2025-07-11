import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function remove_antagonist_handler(db: GameDatabase, args: any) {
  // Input validation
  if (
    !args ||
    typeof args.antagonist_id !== 'number' ||
    Number.isNaN(args.antagonist_id)
  ) {
    return { content: [
      "❌ Invalid or missing 'antagonist_id': must be a valid number."
    ].map(makeTextContent), isError: true };
  }
  const { antagonist_id } = args;
  console.log('[REMOVE_ANTAGONIST] Attempting delete:', antagonist_id);
  try {
    const success = await db.antagonists.removeAntagonist(antagonist_id);

    if (!success) {
      console.warn('[REMOVE_ANTAGONIST] Deletion failed; antagonist may not exist or is referenced by others:', antagonist_id);
      return { content: [`❌ Could not remove antagonist with ID ${antagonist_id}. It may be referenced by other records (e.g., inventory, encounters, or status effects). Ensure it is not in use elsewhere.`].map(makeTextContent), isError: true };
    }

    console.log('[REMOVE_ANTAGONIST] Delete succeeded for antagonist ID:', antagonist_id);
    return { content: [`✅ Antagonist with ID ${antagonist_id} removed successfully.`].map(makeTextContent) };
  } catch (error: any) {
    const errMsg = error?.message ?? String(error);
    if (errMsg.includes('FOREIGN KEY constraint failed')) {
      console.error('[REMOVE_ANTAGONIST] FOREIGN KEY constraint failed:', antagonist_id, errMsg);
      return { content: [`❌ Cannot remove antagonist with ID ${antagonist_id} — there are still dependent records (inventory, encounters, etc.) referencing it. Remove or reassign these dependencies first.`].map(makeTextContent), isError: true };
    }
    console.error('[REMOVE_ANTAGONIST] Handler exception:', antagonist_id, errMsg);
    return { content: [`❌ Error removing antagonist: ${errMsg}`].map(makeTextContent), isError: true };
  }
}