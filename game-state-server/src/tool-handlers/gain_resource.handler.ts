// In game-state-server/src/tool-handlers/gain_resource.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function gain_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, roll_successes } = args;

  // Input Validation
  if (typeof character_id !== 'number') {
    return { content: makeTextContentArray(["❌ character_id must be a number."]), isError: true };
  }
  if (typeof resource_name !== 'string') {
    return { content: makeTextContentArray(["❌ resource_name must be a string."]), isError: true };
  }
  if (typeof roll_successes !== 'number' || roll_successes < 0) {
    return { content: makeTextContentArray(["❌ roll_successes must be a non-negative number."]), isError: true };
  }
  
  // Use the logic from restore_resource but with the value from roll_successes
  const { restore_resource_handler } = await import('./restore_resource.handler.js');
  return restore_resource_handler(db, { character_id, resource_name, amount: roll_successes });
}