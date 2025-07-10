// game-state-server/src/tool-handlers/apply_damage.handler.ts
import type { GameDatabase } from '../types/db.types.js';
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
    const { target_id, amount = 1, level = "bruised" } = args;

    if (typeof target_id !== 'number') {
      return { content: makeTextContentArray(["❌ target_id must be a number."]), isError: true };
    }
    if (typeof amount !== 'number') {
      return { content: makeTextContentArray(["❌ amount must be a number."]), isError: true };
    }
    if (typeof level !== 'string') {
      return { content: makeTextContentArray(["❌ level must be a string."]), isError: true };
    }
    if (!['bruised', 'hurt', 'injured', 'wounded', 'mauled', 'crippled', 'incapacitated'].includes(level)) {
      return { content: makeTextContentArray(["❌ Invalid level value."]), isError: true };
    }

    const dmg = {
      bashing: level === "bruised" ? amount : 0,
      lethal: level === "hurt" || level === "injured" || level === "wounded" ? amount : 0,
      aggravated: level === "mauled" || level === "crippled" || level === "incapacitated" ? amount : 0,
    };
    const character = db.characters.applyDamage(target_id, dmg);

    if (!character) {
      return { content: makeTextContentArray([`❌ Character with ID ${target_id} not found.`]), isError: true };
    }

    return { content: makeTextContentArray([`Damage applied (${amount} ${level}) to Character id ${target_id}`]) };
  } catch (error: unknown) {
    // TODO: Specify correct type for error
    const errMsg = typeof error === "object" && error && "message" in error ? (error as { message: string }).message : String(error);
    console.error("apply_damage_handler error:", error);
    return { content: makeTextContentArray([`❌ Error applying damage: ${errMsg}`]), isError: true };
  }
}