// game-state-server/src/tool-handlers/gain_resource.handler.ts
import { GameDatabase } from '../db.js';

import type { CharacterData } from '../types/character.types.js';

export interface GainResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function gain_resource_handler(
  args: GainResourceArgs
): Promise<HandlerResponse> {
  try {
    const db = new GameDatabase();
    // TODO: Implement CharacterRepository.gainResource for resource-specific logic.
    // For now, patch relevant field (e.g., increasing willpower, gnosis, etc.)
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: [{ type: 'text', text: `❌ Character with ID ${args.character_id} not found.` }], isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount = 1
    const { resource_name, amount = 1 } = args;
    const prev = character[resource_name] ?? 0;
    const updates: Partial<CharacterData> = {};
    updates[resource_name] = prev + amount;
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: [{ type: 'text', text: `Resource ${resource_name} (+${amount}) gained for Character id ${args.character_id}` }] };
    // TODO: Dedicated gainResource logic (e.g., cap checks) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("gain_resource_handler error:", error);
    return { content: [{ type: 'text', text: `❌ Error gaining resource: ${errMsg}` }], isError: true };
  }
}