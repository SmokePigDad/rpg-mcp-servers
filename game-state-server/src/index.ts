// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
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

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
export function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => ({ type: 'text', text: JSON.stringify(entry, null, 2) }));
}

const toolDispatcher: Record<string, (args: any) => Promise<any>> = {
  // Character Management
  'create_character': create_character_handler,
  'get_character': get_character_handler,
  'get_character_by_name': get_character_by_name_handler,
  'update_character': update_character_handler,
  'list_characters': list_characters_handler,

  // Antagonist Management
  'create_antagonist': create_antagonist_handler,
  'get_antagonist': get_antagonist_handler,
  'update_antagonist': update_antagonist_handler,
  'list_antagonists': list_antagonists_handler,
  'remove_antagonist': remove_antagonist_handler,

  // Resources & Health
  'spend_resource': spend_resource_handler,
  'restore_resource': restore_resource_handler,
  'gain_resource': gain_resource_handler,
  'apply_damage': apply_damage_handler,

  // XP & Progression
  'award_xp': award_xp_handler,
  'spend_xp': spend_xp_handler,
  'improve_trait': improve_trait_handler,
  'get_trait_improvement_cost': get_trait_improvement_cost_handler,

  // Status Effects
  'apply_status_effect': apply_status_effect_handler,
  'get_status_effects': get_status_effects_handler,
  'remove_status_effect': remove_status_effect_handler,

  // Inventory
  'add_item': add_item_handler,
  'get_inventory': get_inventory_handler,
  'update_item': update_item_handler,
  // 'remove_item': remove_item_handler, // TODO: Wire handler after implementation

  // World State & Initiative
  // These handlers must be imported and wired similarly; add import and handler as implemented
  // 'save_world_state': save_world_state_handler,
  // 'get_world_state': get_world_state_handler,
  // 'save_story_progress': save_story_progress_handler,
  // 'set_initiative': set_initiative_handler,
  // 'get_initiative_order': get_initiative_order_handler,
  // 'advance_turn': advance_turn_handler,
  // 'get_current_turn': get_current_turn_handler,
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
      const result = await handler(args);
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
