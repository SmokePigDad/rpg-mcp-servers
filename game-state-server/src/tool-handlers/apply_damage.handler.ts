// game-state-server/src/tool-handlers/apply_damage.handler.ts
import { GameDatabase } from '../db.js';
import { makeTextContentArray } from '../index.js';

import type { CharacterData } from '../types/character.types.js';

export interface ApplyDamageArgs {
  target_id: number;
  amount?: number;
  level?: string;
}

type HandlerResponse = { content: { type: string, text: string }[]; isError?: boolean };

export async function apply_damage_handler(db: GameDatabase, args: ApplyDamageArgs): Promise<HandlerResponse> {
  try {
    // Ideally there should be an applyDamage method in CharacterRepository.
    // TODO: Implement CharacterRepository.applyDamage, for now we patch health_levels directly.
    const character = await db.characters.getCharacterById(args.target_id);
    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${args.target_id} not found.`]), isError: true };
    }

    // Patch health. Assumes damage amount/type in args (e.g., { amount: 2, level: "bruised" })
    // NOTE: This is placeholder logic and may need to match your game's actual health model.
    const { amount = 1, level = "bruised" } = args;
    const prevHealth = character.health_levels ? JSON.parse(character.health_levels) : {};
    prevHealth[level] = (prevHealth[level] || 0) + amount;

    // Save updated health_levels
    await db.characters.updateCharacter(args.target_id, { health_levels: JSON.stringify(prevHealth) });

    return { content: makeTextContentArray([`Damage applied (${amount} ${level}) to Character id ${args.target_id}`]) };
    // TODO: For proper game logic, add applyDamage to CharacterRepository, including type validation, overflow rules, etc.
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("apply_damage_handler error:", error);
    return { content: makeTextContentArray([`❌ Error applying damage: ${errMsg}`]), isError: true };
  }
}