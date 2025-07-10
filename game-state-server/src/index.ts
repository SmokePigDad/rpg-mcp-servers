// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Local Imports
import { createDatabase, initializeSchema } from './schema.js';
import { createGameDatabase } from './repositories/game-database.js';
import type { GameDatabase as GameDatabaseType } from './types/db.types.js';

// Centralized Tool Imports
import { toolDefinitions } from './tool-definitions.js';
import { toolDispatcher } from './tool-handlers/index.js';

/**
 * Utility to ensure all MCP content is correctly formatted as text.
 * This prevents client-side ZodErrors for non-text content.
 */
export function makeTextContentArray(contentArr: any[]): { type: 'text'; text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === 'string') {
      return { type: 'text', text: entry };
    }
    // For any other objects/values, serialize as prettified JSON.
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}

async function startServer() {
  try {
    console.log("Initializing game-state-server...");

    // --- 1. Database Setup (Do this first) ---
    const DATA_DIR = join(process.cwd(), 'data');
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const DB_PATH = join(DATA_DIR, 'game-state.db');
    const db = createDatabase(DB_PATH);
    initializeSchema(db);
    const gameDatabase: GameDatabaseType = createGameDatabase(db);
    console.log("Database initialized successfully.");

    // --- 2. Prepare Tool Definitions for the Server ---
    const allToolDefinitions = Object.values(toolDefinitions);
    const toolsForServer = Object.fromEntries(
      allToolDefinitions.map(tool => [tool.name, tool])
    );

    // --- 3. Initialize the Server with All Tools Defined ---
    const server = new Server(
      { name: 'rpg-game-state-server', version: '2.1.0' },
      {
        capabilities: {
          // This is the critical part: tools are registered at creation time.
          tools: toolsForServer
        },
      }
    );

    // --- 4. Set Up Request Handlers ---
    
    // This handler responds when a client asks "what tools do you have?"
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: allToolDefinitions };
    });

    // This handler executes a tool when a client calls one.
    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      const handler = toolDispatcher[name];

      if (handler) {
        try {
          // Call the correct handler function from our dispatcher
          return await handler(gameDatabase, args);
        } catch (error: any) {
          console.error(`Error in tool '${name}':`, error);
          return { 
            content: makeTextContentArray([`❌ Error executing '${name}': ${error.message}`]), 
            isError: true 
          };
        }
      }

      // If the handler is not found in our dispatcher
      return { 
        content: makeTextContentArray([`❌ Unknown tool in game-state-server: ${name}`]), 
        isError: true 
      };
    });

    // --- 5. Connect and Start Listening ---
    const transport = new StdioServerTransport();
    server.connect(transport);
    console.error('✅ oWoD RPG Game State MCP Server v2.1.0 running on stdio');

  } catch (error: any) {
    console.error('❌ FATAL: Server failed to start:', error.message);
    process.exit(1);
  }
}

// Run the server
startServer();
