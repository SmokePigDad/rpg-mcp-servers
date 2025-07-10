// File: game-state-server/src/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { formatSheetByGameLine } from './characterSheets.js';
import { GameDatabase, type AntagonistRow } from './db.js';

console.log("Initializing server...");
const server = new Server({ name: 'rpg-game-state-server', version: '2.1.0' }, { capabilities: { tools: {} } });
console.log("Server initialized.");

console.log("Initializing database...");
const db = new GameDatabase();
console.log("Database initialized.");




process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Utility: Serialize any array of strings/objects as { type: 'text', text: string }[] for MCP compliance
function makeTextContentArray(contentArr: any[]): { type: 'text', text: string }[] {
  return contentArr.map(entry => {
    if (typeof entry === "string") {
      return { type: 'text', text: entry };
    }
    if (entry && typeof entry === "object" && entry.type === "text" && typeof entry.text === "string") {
      // Already compliant
      return entry;
    }
    // For any other objects/values, serialize as prettified JSON
    return { type: 'text', text: JSON.stringify(entry, null, 2) };
  });
}

console.log("About to define toolDefinitions...");
const toolDefinitions: any[] = [
  {
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
        renown_glory: { type: 'number', description: 'Glory Renown', nullable: true },
        renown_honor: { type: 'number', description: 'Honor Renown', nullable: true },
        renown_wisdom: { type: 'number', description: 'Wisdom Renown', nullable: true },
        // Mage-specific fields
        tradition_convention: { type: 'string', description: 'Mage tradition or Convention', nullable: true },
        arete: { type: 'number', description: 'Mage Arete', nullable: true },
        quintessence: { type: 'number', description: 'Mage Quintessence', nullable: true },
        paradox: { type: 'number', description: 'Mage Paradox', nullable: true },
        // Changeling-specific fields
        kith: { type: 'string', description: 'Changeling kith', nullable: true },
        seeming: { type: 'string', description: 'Changeling seeming', nullable: true },
        glamour_current: { type: 'number', description: 'Current Glamour', nullable: true },
        glamour_permanent: { type: 'number', description: 'Permanent Glamour', nullable: true },
        banality_permanent: { type: 'number', description: 'Permanent Banality', nullable: true },
        // Optional traits
        abilities: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Starting abilities for the character' },
        disciplines: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Starting disciplines (Vampire only)' },
        spheres: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Spheres (Mage only)' },
        arts: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Changeling Arts' },
        realms: { type: 'array', items: { type: 'object' }, nullable: true, description: 'Changeling Realms' }
      },
      required: ['name', 'game_line']
    }
  },
  {
    name: 'get_character',
    description: 'Retrieve full character data.',
    inputSchema: {
      type: 'object',
      properties: { character_id: { type: 'number' } },
      required: ['character_id']
    }
  },
  {
    name: 'get_character_by_name',
    description: 'Retrieve character by name.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name']
    }
  },
  {
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
  {
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
  {
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
  {
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
  {
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
];

console.log("Initial toolDefinitions array created. Length:", toolDefinitions.length);

// Register MCP handlers
console.log("Registering ListToolsRequestSchema handler...");
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("ListToolsRequestSchema handler called!");
  return { tools: toolDefinitions };
});

console.log("Registering CallToolRequestSchema handler...");
server.setRequestHandler(CallToolRequestSchema, handleToolRequest);

const transport = new StdioServerTransport();
server.connect(transport);

export async function handleToolRequest(request: any) {
  const { name, arguments: args } = request.params;
  console.log(`Handling tool request: ${name}`);
  try {
    console.log(`Inside try block, before switch statement: ${name}`);
    switch (name) {
      case 'spend_xp': {
        const { character_id, amount, reason, trait_name } = args;

        if (amount <= 0) {
          return { content: [{ type: 'text', text: '❌ Amount must be positive.' }], isError: true };
        }

        // Further implementation for 'spend_xp'...
        return { content: [{ type: 'text', text: '🛠 spend_xp handler TODO' }] };
      } // end spend_xp case
    } // end switch
  } catch (error: any) {
    console.error("handleToolRequest error:", error);
    return { content: [{ type: 'text', text: `❌ Internal server error: ${error.message}` }], isError: true };
  }
  // If no case matches, always return a MCP-compliant error response
  return { content: [{ type: "text", text: "❌ Unknown tool request." }], isError: true };
} // end handleToolRequest


