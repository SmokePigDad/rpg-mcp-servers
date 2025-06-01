import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';

// Initialize database
const db = new GameDatabase();

// Create server instance
const server = new Server({
  name: 'rpg-game-state-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_character',
      description: 'Create a new character',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          class: { type: 'string' },
          stats: {
            type: 'object',
            properties: {
              strength: { type: 'number' },
              dexterity: { type: 'number' },
              constitution: { type: 'number' },
              intelligence: { type: 'number' },
              wisdom: { type: 'number' },
              charisma: { type: 'number' }
            }
          }
        },
        required: ['name', 'class']
      }
    },
    {
      name: 'get_character',
      description: 'Get character information',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' }
        },
        required: ['character_id']
      }
    },
    {
      name: 'update_character',
      description: 'Update character stats',
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
      name: 'add_item',
      description: 'Add item to inventory',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' },
          item_name: { type: 'string' },
          item_type: { type: 'string' },
          quantity: { type: 'number' },
          properties: { type: 'object' }
        },
        required: ['character_id', 'item_name']
      }
    },
    {
      name: 'get_inventory',
      description: 'Get character inventory',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' }
        },
        required: ['character_id']
      }
    },
    {
      name: 'list_characters',
      description: 'List all characters',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'get_character_by_name',
      description: 'Get character by name',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    },
    {
      name: 'save_world_state',
      description: 'Save the current world state',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' },
          location: { type: 'string' },
          npcs: { type: 'object' },
          events: { type: 'object' },
          environment: { type: 'object' }
        },
        required: ['character_id', 'location']
      }
    },
    {
      name: 'get_world_state',
      description: 'Get the current world state',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' }
        },
        required: ['character_id']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_character': {
        const { name: charName, class: charClass, stats = {} } = args as any;
        
        const character = db.createCharacter({
          name: charName,
          class: charClass,
          ...stats
        });
        
        return {
          content: [{ type: 'text', text: JSON.stringify(character, null, 2) }]
        };
      }

      case 'get_character': {
        const character = db.getCharacter((args as any).character_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(character, null, 2) }]
        };
      }

      case 'update_character': {
        const { character_id, updates } = args as any;
        
        const character = db.updateCharacter(character_id, updates);
        return {
          content: [{ type: 'text', text: JSON.stringify(character, null, 2) }]
        };
      }

      case 'add_item': {
        const { character_id, item_name, item_type = 'misc', quantity = 1, properties = {} } = args as any;
        
        const item = db.addItem(character_id, {
          name: item_name,
          type: item_type,
          quantity,
          properties
        });
        
        return {
          content: [{ type: 'text', text: `Added ${quantity} ${item_name} to inventory` }]
        };
      }

      case 'get_inventory': {
        const items = db.getInventory((args as any).character_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(items, null, 2) }]
        };
      }

      case 'list_characters': {
        const characters = db.listCharacters();
        return {
          content: [{ type: 'text', text: JSON.stringify(characters, null, 2) }]
        };
      }

      case 'get_character_by_name': {
        const character = db.getCharacterByName((args as any).name);
        return {
          content: [{ type: 'text', text: JSON.stringify(character, null, 2) }]
        };
      }

      case 'save_world_state': {
        const { character_id, location, npcs, events, environment } = args as any;
        db.saveWorldState(character_id, { location, npcs, events, environment });
        return {
          content: [{ type: 'text', text: 'World state saved successfully' }]
        };
      }

      case 'get_world_state': {
        const worldState = db.getWorldState((args as any).character_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(worldState, null, 2) }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
console.error('RPG Game State MCP Server running on stdio');
