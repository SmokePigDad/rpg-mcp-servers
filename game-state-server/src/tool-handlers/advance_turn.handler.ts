// In game-state-server/src/tool-handlers/advance_turn.handler.ts
import { makeTextContentArray } from '../index.js';
import type { GameDatabase } from '../types/db.types.js';

export async function advance_turn_handler(db: GameDatabase, args: any) {
  if (!args || typeof args.scene_id !== 'string') {
    return { 
      content: makeTextContentArray(["❌ Invalid or missing 'scene_id'. Must be a string."]), 
      isError: true 
    };
  }

  const { scene_id } = args;
  
  try {
    const result = db.worldState.advanceTurn(scene_id);

    if (!result.success || !result.next_actor) {
      return { content: makeTextContentArray([`❌ ${result.message || 'Could not advance turn.'}`]), isError: true };
    }

    const { next_actor, new_round, new_turn_order } = result;

    // Create a human-readable summary
    const output = `🔄 Turn Advanced in Scene: '${scene_id}'\n\n` +
                   `▶️ **Current Actor:** ${next_actor.actor_name} (Initiative: ${next_actor.initiative_score})\n` +
                   `**Round:** ${new_round}, **Turn:** ${new_turn_order}`;
    
    // --- FIX: Embed the structured data as a JSON string inside the single text content block ---
    const fullResponseText = `${output}\n\n---\n${JSON.stringify(result, null, 2)}`;

    return {
      // The content array now contains only ONE text object, which is compliant.
      content: [{ type: 'text', text: fullResponseText }]
    };

  } catch (error: any) {
    console.error(`[advance_turn_handler] Error:`, error);
    return { 
      content: makeTextContentArray([`❌ An unexpected error occurred while advancing the turn: ${error.message}`]), 
      isError: true 
    };
  }
}