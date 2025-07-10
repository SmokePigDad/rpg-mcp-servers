// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import fs from 'fs';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server as MCPServer } from '@modelcontextprotocol/sdk/server/index.js';

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
import { toolDefinitions } from './tool-definitions.js';
import { formatSheetByGameLine } from './characterSheets.js';
import { createDatabase, initializeSchema } from './schema.js';
import type { GameDatabase as GameDatabaseType } from './types/db.types.js';
import { createGameDatabase } from './repositories/game-database.js';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { AntagonistRow } from './types/antagonist.types.js';

import { spend_xp_handler } from './tool-handlers/spend_xp.handler.js';

// Import repositories for the new data access pattern
import {
  CharacterRepository,
  AntagonistRepository,
  InventoryRepository,
  StatusEffectRepository,
} from './repositories/index.js';
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

// Centralized toolDefinitions import

import { toolDispatcher } from './tool-handlers/index.js';

async function startServer() {
  try {
    console.log("Initializing server...");

    // 1. Load tool definitions first
    const allTools = Object.values(toolDefinitions);

    // 2. Pass the tools directly into the constructor
    const server = new Server(
      { name: 'rpg-game-state-server', version: '2.1.0' },
      {
        capabilities: {
          // Create the tools map that the SDK expects
          tools: Object.fromEntries(allTools.map(tool => [tool.name, tool]))
        }
      }
    );
    const transport = new StdioServerTransport();
    
    console.log("Initializing database...");
    let repositories: GameDatabaseType;
    try {
      // Create data directory if it doesn't exist
      const DATA_DIR = join(process.cwd(), 'data');
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }
      const DB_PATH = join(DATA_DIR, 'game-state.db');
      
      // Create and configure database
      const db = createDatabase(DB_PATH);
      
      // Initialize schema
      initializeSchema(db);
      
      console.log("Database initialized successfully.");

      // Use canonical aggregated GameDatabase interface for handlers
      repositories = createGameDatabase(db);
    } catch (err: any) {
      console.error("Error initializing database:", err.message);
      process.exit(1);
    }
    
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: Object.values(toolDefinitions) };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
        const { name, arguments: args } = request.params;
        const handler = toolDispatcher[name];
        if (handler) {
            try {
                return await handler(repositories, args);
            } catch (error: any) {
                console.error(`Error in tool '${name}':`, error);
                return { content: makeTextContentArray([`❌ Error in tool '${name}': ${error.message}`]), isError: true };
            }
        }
        return { content: makeTextContentArray([`❌ Unknown tool: ${name}`]), isError: true };
    });
    
    server.connect(transport);
    console.error('✅ oWoD RPG Game State MCP Server v2.1.0 running on stdio');

  } catch (error: any) {
    console.error('❌ FATAL: Server failed to start:', error.message);
    process.exit(1);
  }
}

startServer();