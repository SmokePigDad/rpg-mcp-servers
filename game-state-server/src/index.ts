// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { formatSheetByGameLine } from './characterSheets.js';
import { GameDatabase, type AntagonistRow } from './db.js';

import { spend_xp_handler } from './tool-handlers/spend_xp.handler.js';
import { create_character_handler } from './tool-handlers/create_character.handler.js';
import { get_character_handler } from './tool-handlers/get_character.handler.js';
import { get_character_by_name_handler } from './tool-handlers/get_character_by_name.handler.js';
import { update_character_handler } from './tool-handlers/update_character.handler.js';
import { spend_resource_handler } from './tool-handlers/spend_resource.handler.js';
import { restore_resource_handler } from './tool-handlers/restore_resource.handler.js';
import { gain_resource_handler } from './tool-handlers/gain_resource.handler.js';
import { apply_damage_handler } from './tool-handlers/apply_damage.handler.js';

console.log("Initializing server...");

// Define tool definitions
const toolDefinitions = {
  create_character: {
    name: 'create_character',
    description: 'Create a new oWoD character.',
    inputSchema: {
      type: 'object',
      properties: {
        // Core character properties
        name: { type: 'string', description: 'Character name' },
        concept: { type: 'string', description: 'Character concept', nullable: true },
        game_line: { type: 'string', enum: ['vampire', 'werewolf', 'mage', 'changeling'], description: 'Game line/splat' },
        // Vampire-specific fields
        clan: { type: 'string', description: 'Vampire clan (e.g., Brujah, Malkavian)', nullable: true },
        generation: { type: 'number', description: 'Vampire generation', nullable: true },
        blood_pool_current: { type: 'number', description: 'Current Blood Pool', nullable: true },
        blood_pool_max: { type: 'number', description: 'Max Blood Pool', nullable: true },
        humanity: { type: 'number', description: 'Humanity (Vampire only)', nullable: true },
        // Werewolf-specific fields
        breed: { type: 'string', description: 'Werewolf breed (e.g., Homid, Metis, Lupus)', nullable: true },
        auspice: { type: 'string', description: 'Werewolf auspice (e.g., Ragabash, Theurge)', nullable: true },
        tribe: { type: 'string', description: 'Werewolf tribe', nullable: true },
        gnosis_current: { type: 'number', description: 'Current Gnosis', nullable: true },
        gnosis_permanent: { type: 'number', description: 'Permanent Gnosis', nullable: true },
        rage_current: { type: 'number', description: 'Current Rage', nullable: true },
        rage_permanent: { type: 'number', description: 'Permanent Rage', nullable: true },
        renown_glory: { type: 'string', description: 'Glory Renown', nullable: true },
        renown_honor: { type: 'string', description: 'Honor Renown', nullable: true },
        renown_wisdom: { type: 'string', description: 'Wisdom Renown', nullable: true },
        tradition_convention: { type: 'string', description: 'Mage tradition or Convention', nullable: true },
        arete: { type: 'number', description: 'Mage Arete', nullable: true },
        quintessence: { type: 'number', description: 'Mage Quintessence', nullable: true },
        paradox: { type: 'number', description: 'Mage Paradox', nullable: true },
        kith: { type: 'string', description: 'Changeling kith', nullable: true },
        seeming: { type: 'string', description: 'Changeling seeming', nullable: true },
        glamour_current: { type: 'number', description: 'Current Glamour', nullable: true },
        glamour_permanent: { type: 'number', description: 'Permanent Glamour', nullable: true },
        banality_permanent: { type: 'number', description: 'Permanent Banality', nullable: true },
        abilities: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Starting abilities for the character' },
        disciplines: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Starting disciplines (Vampire only)' },
        spheres: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Spheres (Mage only)' },
        arts: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Changeling Arts' },
        realms: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Changeling Realms' }
      },
      required: ['name', 'game_line']
    }
  },
  get_character: {
    name: 'get_character',
    description: 'Retrieve full character data.',
    inputSchema: {
      type: 'object',
      properties: { character_id: { type: 'number' } },
      required: ['character_id']
    }
  },
  get_character_by_name: {
    name: 'get_character_by_name',
    description: 'Retrieve character by name.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name']
    }
  },
  update_character: {
    name: 'update_character',
    description: 'Update character traits.',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        updates: { type: 'object' }
      },
      required: ['character_id', 'updates']
    }
  },
  spend_resource: {
    name: 'spend_resource',
    description: 'Spend a character resource.',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        resource_name: { type: 'string', enum: ['willpower', 'blood', 'gnosis', 'rage', 'glamour', 'quintessence', 'paradox'] },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id', 'resource_name']
    }
  },
  restore_resource: {
    name: "restore_resource",
    description: "Restore a character resource like Willpower, Blood, etc.",
    inputSchema: {
      type: "object",
      properties: {
        character_id: { type: "number" },
        resource_name: { type: "string", enum: ['willpower', 'blood', 'gnosis', 'rage', 'glamour', 'quintessence'] },
        amount: { type: 'number', default: 1 }
      },
      required: ['character_id', 'resource_name']
    }
  },
  gain_resource: {
    name: 'gain_resource',
    description: 'Gain a resource through an in-game action (e.g., feeding, meditation, quest). Applies game-line–specific logic.',
    inputSchema: {
      type: 'object',
      properties: {
        character_id: { type: 'number' },
        resource_name: { type: 'string', enum: ['willpower', 'blood', 'gnosis', 'glamour', 'quintessence'] },
        roll_successes: { type: 'number', minimum: 1 }
      },
      required: ['character_id', 'resource_name', 'roll_successes']
    }
  },
  apply_damage: {
    name: 'apply_damage',
    description: 'Apply health level damage to a target after a successful damage roll.',
    inputSchema: {
      type: 'object',
      properties: {
        target_type: { type: 'string', enum: ['character', 'npc'] },
        target_id: { type: 'number' },
        damage_successes: { type: 'number', description: 'The number of successes from the damage roll.' },
        damage_type: { type: 'string', enum: ['bashing', 'lethal', 'aggravated'], default: 'lethal' }
      },
      required: ['target_type', 'target_id', 'damage_successes', 'damage_type']
    }
  }
};

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
  'create_character': create_character_handler,
  'get_character': get_character_handler,
  'get_character_by_name': get_character_by_name_handler,
  'update_character': update_character_handler,
  'spend_resource': spend_resource_handler,
  'restore_resource': restore_resource_handler,
  'gain_resource': gain_resource_handler,
  'apply_damage': apply_damage_handler
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
