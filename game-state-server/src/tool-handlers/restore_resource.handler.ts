// game-state-server/src/tool-handlers/restore_resource.handler.ts
import { GameDatabase } from '../db.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface RestoreResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function restore_resource_handler(
  db: GameDatabase,
  args: RestoreResourceArgs
): Promise<HandlerResponse> {
  // Input validation
  if (
    !args ||
    typeof args.character_id !== "number" ||
    Number.isNaN(args.character_id) ||
    typeof args.resource_name !== "string" ||
    args.resource_name.trim().length === 0 ||
    (args.amount !== undefined && (typeof args.amount !== "number" || Number.isNaN(args.amount)))
  ) {
    return { content: makeTextContentArray([
      "❌ Invalid or missing arguments: 'character_id' must be a valid number, 'resource_name' must be a non-empty string, and 'amount' (if provided) must be a valid number."
    ]), isError: true };
  }
  try {
    // TODO: Implement CharacterRepository.restoreResource for resource restoration semantics.
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount restores to value or adds amount
    const { resource_name, amount } = args;
    const maxResource = character[`${resource_name}_permanent`] || character[resource_name]; // Fallback
    const updates: Partial<CharacterData> = {};
    if (typeof amount === 'number') {
      // Clamp to max
      updates[resource_name] = Math.min((character[resource_name] ?? 0) + amount, maxResource ?? amount);
    } else {
      // Optional: If direct restore
      // updates[resource_name] = maxResource;
    }
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: makeTextContentArray([`Resource ${resource_name} restored for Character id ${args.character_id}`]) };
    // TODO: Dedicated restoreResource logic (caps, full/partial restore rules) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("restore_resource_handler error:", error);
    return { content: makeTextContentArray([`❌ Error restoring resource: ${errMsg}`]), isError: true };
  }
}