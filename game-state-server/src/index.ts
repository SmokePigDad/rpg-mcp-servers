// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
export function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === "string") {
      return { type: 'text', text: entry };
    }
    // For any other objects/values, serialize as prettified JSON
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}
import { formatSheetByGameLine } from './characterSheets.js';
import { GameDatabase } from './db.js';
import type { AntagonistRow } from './types/antagonist.types.js';

import { spend_xp_handler } from './tool-handlers/spend_xp.handler.js';
import { create_character_handler } from './tool-handlers/create_character.handler.js';
import { get_character_handler } from './tool-handlers/get_character.handler.js';
import { get_character_by_name_handler } from './tool-handlers/get_character_by_name.handler.js';
import { update_character_handler } from './tool-handlers/update_character.handler.js';
import { spend_resource_handler } from './tool-handlers/spend_resource.handler.js';
import { restore_resource_handler } from './tool-handlers/restore_resource.handler.js';
import { gain_resource_handler } from './tool-handlers/gain_resource.handler.js';
import { apply_damage_handler } from './tool-handlers/apply_damage.handler.js';

// Additional handlers imported by tool name for full MCP compliance
import { list_characters_handler } from './tool-handlers/list_characters.handler.js';

import { create_antagonist_handler } from './tool-handlers/create_antagonist.handler.js';
import { get_antagonist_handler } from './tool-handlers/get_antagonist.handler.js';
import { update_antagonist_handler } from './tool-handlers/update_antagonist.handler.js';
import { list_antagonists_handler } from './tool-handlers/list_antagonists.handler.js';
import { remove_antagonist_handler } from './tool-handlers/remove_antagonist.handler.js';

import { award_xp_handler } from './tool-handlers/award_xp.handler.js';
import { improve_trait_handler } from './tool-handlers/improve_trait.handler.js';
import { get_trait_improvement_cost_handler } from './tool-handlers/get_trait_improvement_cost.handler.js';

import { apply_status_effect_handler } from './tool-handlers/apply_status_effect.handler.js';
import { get_status_effects_handler } from './tool-handlers/get_status_effects.handler.js';
import { remove_status_effect_handler } from './tool-handlers/remove_status_effect.handler.js';

import { add_item_handler } from './tool-handlers/add_item.handler.js';
import { get_inventory_handler } from './tool-handlers/get_inventory.handler.js';
import { update_item_handler } from './tool-handlers/update_item.handler.js';
import { remove_item_handler } from './tool-handlers/remove_item.handler.js';
import { save_world_state_handler } from './tool-handlers/save_world_state.handler.js';
import { get_world_state_handler } from './tool-handlers/get_world_state.handler.js';
import { save_story_progress_handler } from './tool-handlers/save_story_progress.handler.js';
import { set_initiative_handler } from './tool-handlers/set_initiative.handler.js';
import { get_initiative_order_handler } from './tool-handlers/get_initiative_order.handler.js';
import { advance_turn_handler } from './tool-handlers/advance_turn.handler.js';
import { get_current_turn_handler } from './tool-handlers/get_current_turn.handler.js';

console.log("Initializing server...");

// Centralized toolDefinitions import
import { toolDefinitions } from './tool-definitions.js';

console.log("Initial toolDefinitions array created. Length:", Object.keys(toolDefinitions).length);

const transport = new StdioServerTransport();
const server = new Server({ name: 'rpg-game-state-server', version: '2.1.0' }, { capabilities: { tools: toolDefinitions } });

console.log("Initializing database...");
let db: GameDatabase;
try {
  db = new GameDatabase();
  console.log("Database initialized successfully.");
} catch (err) {
  console.error("Error initializing database:", err);
  process.exit(1);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});


const toolDispatcher: Record<string, (db: GameDatabase, args: any) => Promise<any>> = {
  // Character Management
  'create_character': (db, args) => create_character_handler(db, args),
  'get_character': (db, args) => get_character_handler(db, args),
  'get_character_by_name': (db, args) => get_character_by_name_handler(db, args),
  'update_character': (db, args) => update_character_handler(db, args),
  'list_characters': (db, args) => list_characters_handler(db, args),

  // Antagonist Management
  'create_antagonist': (db, args) => create_antagonist_handler(db, args),
  'get_antagonist': (db, args) => get_antagonist_handler(db, args),
  'update_antagonist': (db, args) => update_antagonist_handler(db, args),
  'list_antagonists': (db, args) => list_antagonists_handler(db, args),
  'remove_antagonist': (db, args) => remove_antagonist_handler(db, args),

  // Resources & Health
  'spend_resource': (db, args) => spend_resource_handler(db, args),
  'restore_resource': (db, args) => restore_resource_handler(db, args),
  'gain_resource': (db, args) => gain_resource_handler(db, args),
  'apply_damage': (db, args) => apply_damage_handler(db, args),

  // XP & Progression
  'award_xp': (db, args) => award_xp_handler(db, args),
  'spend_xp': (db, args) => spend_xp_handler(db, args),
  'improve_trait': (db, args) => improve_trait_handler(db, args),
  'get_trait_improvement_cost': (db, args) => get_trait_improvement_cost_handler(db, args),

  // Status Effects
  'apply_status_effect': (args) => apply_status_effect_handler(db, args),
  'get_status_effects': (args) => get_status_effects_handler(db, args),
  'remove_status_effect': (args) => remove_status_effect_handler(db, args),

  // Inventory
  'add_item': (args) => add_item_handler(db, args),
  'get_inventory': (args) => get_inventory_handler(db, args),
  'update_item': (args) => update_item_handler(db, args),
  'remove_item': (args) => remove_item_handler(db, args),

  // World State & Initiative
  'save_world_state': (args) => save_world_state_handler(db, args),
  'get_world_state': (args) => get_world_state_handler(db, args),
  'save_story_progress': (args) => save_story_progress_handler(db, args),
  'set_initiative': (args) => set_initiative_handler(db, args),
  'get_initiative_order': (args) => get_initiative_order_handler(db, args),
  'advance_turn': (args) => advance_turn_handler(db, args),
  'get_current_turn': (args) => get_current_turn_handler(db, args),
};

// Register MCP handlers
console.log("Registering ListToolsRequestSchema handler...");
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("ListToolsRequestSchema handler called!");
  return { tools: Object.values(toolDefinitions) };
});

console.log("Registering CallToolRequestSchema handler...");
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  console.log(`Handling tool request: ${name}`);
  try {
    console.log(`Inside dispatcher for tool name: ${name}`);
    const handler = toolDispatcher[name];
    if (handler) {
      console.log(`Calling handler for tool: ${name} with args:`, args);
      const result = await handler(db, args);
      console.log(`Handler for tool: ${name} completed successfully with result:`, result);
      return result;
    }
  } catch (error: any) {
    console.error("handleToolRequest error:", error);
    return { content: makeTextContentArray([`❌ Internal server error: ${error.message}`]), isError: true };
  }
  // If no handler matches, always return a MCP-compliant error response
  return { content: makeTextContentArray(["❌ Unknown tool request."]) };
});
