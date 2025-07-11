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

// === THIS IS THE CRITICAL PART ===
// Import the single source of truth for all tool definitions and handlers
import { toolDefinitions } from './tool-definitions.js';
import { toolDispatcher } from './tool-handlers/index.js';

/**
 * Utility to ensure all MCP content is correctly formatted as text.
 */
export function makeTextContent(text: string): { type: 'text'; text: string } {
    return { type: 'text', text };
}

async function startServer() {
  try {
    console.log("Initializing game-state-server...");

    // --- 1. Database Setup ---
    const DATA_DIR = join(process.cwd(), '..', 'data');
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const DB_PATH = join(DATA_DIR, 'game-state.db');
    const db = createDatabase(DB_PATH);
    initializeSchema(db);
    const gameDatabase: GameDatabaseType = createGameDatabase(db);
    console.log("Database initialized successfully.");

    // --- 2. Initialize the Server with the Correct Tool Definitions Object ---
    const server = new Server(
      { name: 'rpg-game-state-server', version: '3.0.0' },
      {
        capabilities: {
          // Use the imported toolDefinitions object directly.
          // The SDK expects a map of { [tool_name]: tool_definition }.
          tools: toolDefinitions 
        },
      }
    );

    // --- 3. Set Up Request Handlers ---
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      // For the ListTools request, the SDK expects an array of the definitions.
      return { tools: Object.values(toolDefinitions) };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      const handler = toolDispatcher[name];

      if (handler) {
        try {
          return await handler(gameDatabase, args);
        } catch (error: any) {
          return { content: [makeTextContent(`❌ Error in tool '${name}': ${error.message}`)], isError: true };
        }
      }

      return { content: [makeTextContent(`❌ Unknown tool in game-state-server: ${name}`)], isError: true };
    });

    // --- 4. Connect and Start Listening ---
    const transport = new StdioServerTransport();
    server.connect(transport);
    console.error('✅ oWoD Game State Server v3.0.0 running on stdio');

  } catch (error: any)
  {
    console.error('❌ FATAL: Server failed to start:', error.message);
    process.exit(1);
  }
}

// Run the server
startServer();
