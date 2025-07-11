// In game-state-server/src/tool-handlers/gain_resource.handler.ts
import { makeTextContent } from '../index.js';
import type { GameDatabase } from '../types/index.js';

export async function gain_resource_handler(db: GameDatabase, args: any) {
  const { character_id, resource_name, roll_successes } = args;

  // Input Validation
  if (typeof character_id !== 'number') {
    return { content: ["❌ character_id must be a number."].map(makeTextContent), isError: true };
  }
  if (typeof resource_name !== 'string') {
    return { content: ["❌ resource_name must be a string."].map(makeTextContent), isError: true };
  }
  if (typeof roll_successes !== 'number' || roll_successes < 0) {
    return { content: ["❌ roll_successes must be a non-negative number."].map(makeTextContent), isError: true };
  }
  
  // Use the logic from restore_resource but with the value from roll_successes
  const { restore_resource_handler } = await import('./restore_resource.handler.js');
  return restore_resource_handler(db, { character_id, resource_name, amount: roll_successes });
}