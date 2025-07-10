// game-state-server/src/tool-handlers/spend_resource.handler.ts
import type { GameDatabase } from '../types/db.types.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface SpendResourceArgs {
  character_id: number;
  resource_name: string;
  amount?: number;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function spend_resource_handler(
  db: GameDatabase,
  args: SpendResourceArgs
): Promise<HandlerResponse> {
  try {
    // TODO: Implement CharacterRepository.spendResource for resource spending validation.
    const character = await db.characters.getCharacterById(args.character_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.character_id} not found.`]), isError: true };
    }
    // Example: args.resource_name = 'willpower_current', args.amount = 1
    const { resource_name, amount = 1 } = args;
    const prev = character[resource_name] ?? 0;
    const updates: Partial<CharacterData> = {};
    updates[resource_name] = Math.max(prev - amount, 0);
    await db.characters.updateCharacter(args.character_id, updates);

    return { content: makeTextContentArray([`Resource ${resource_name} (-${amount}) spent for Character id ${args.character_id}`]) };
    // TODO: Dedicated spendResource logic (checks for overspending) should go in repo layer.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("spend_resource_handler error:", error);
    return { content: makeTextContentArray([`❌ Error spending resource: ${errMsg}`]), isError: true };
  }
}