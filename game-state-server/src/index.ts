import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GameDatabase } from './db.js';

// Define interfaces for stronger typing
interface Encounter {
  id: number;
  character_id: number;
  name: string;
  description?: string | null;
  status: string;
  current_round: number;
  current_turn: number;
  environment?: string | null;
  created_at: string;
  ended_at?: string | null;
}

interface EncounterParticipant {
  id: number;
  encounter_id: number;
  participant_type: 'character' | 'npc';
  participant_id: number;
  initiative: number;
  initiative_order?: number | null;
  has_acted: boolean;
  conditions?: string | null;
  is_active: boolean;
  name: string;
  current_hp: number;
  max_hp: number;
}

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

// Define tools array
const toolDefinitions = [
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
      description: 'Add one or more items to a character\'s inventory',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                item_name: { type: 'string' },
                item_type: { type: 'string' },
                quantity: { type: 'number', default: 1 },
                properties: { type: 'object', default: {} }
              },
              required: ['item_name']
            }
          }
        },
        required: ['character_id', 'items']
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
      name: 'remove_item',
      description: 'Remove one or more items from inventory by their IDs',
      inputSchema: {
        type: 'object',
        properties: {
          item_ids: {
            type: 'array',
            items: { type: 'number' }
          }
        },
        required: ['item_ids']
      }
    },
    {
      name: 'update_item',
      description: 'Update item quantity or equipped status',
      inputSchema: {
        type: 'object',
        properties: {
          item_id: { type: 'number' },
          quantity: { type: 'number' },
          equipped: { type: 'boolean' }
        },
        required: ['item_id']
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
    },
    {
      name: 'update_world_state',
      description: 'Update the current world state for a character',
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
    // NPC Management
    {
      name: 'create_npc',
      description: 'Create a new NPC or enemy',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          template: { type: 'string', description: 'Use a preset: goblin, orc, skeleton, etc.' },
          type: { type: 'string', enum: ['enemy', 'ally', 'neutral'] },
          customStats: { type: 'object', description: 'Override template stats' }
        },
        required: ['name']
      }
    },
    {
      name: 'create_npc_group',
      description: 'Create multiple identical NPCs',
      inputSchema: {
        type: 'object',
        properties: {
          template: { type: 'string' },
          count: { type: 'number' },
          namePrefix: { type: 'string' }
        },
        required: ['template', 'count']
      }
    },
    {
      name: 'get_npc',
      description: 'Get NPC information',
      inputSchema: {
        type: 'object',
        properties: {
          npc_id: { type: 'number' }
        },
        required: ['npc_id']
      }
    },
    {
      name: 'list_npcs',
      description: 'List all NPCs',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['enemy', 'ally', 'neutral'] },
          aliveOnly: { type: 'boolean' }
        }
      }
    },
    {
      name: 'update_npc',
      description: 'Update NPC stats',
      inputSchema: {
        type: 'object',
        properties: {
          npc_id: { type: 'number' },
          updates: { type: 'object' }
        },
        required: ['npc_id', 'updates']
      }
    },
    {
      name: 'remove_npc',
      description: 'Remove NPC from game',
      inputSchema: {
        type: 'object',
        properties: {
          npc_id: { type: 'number' }
        },
        required: ['npc_id']
      }
    },
    // Encounter Management
    {
      name: 'create_encounter',
      description: 'Start a new combat encounter',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          environment: { type: 'string' }
        },
        required: ['character_id', 'name']
      }
    },
    {
      name: 'add_to_encounter',
      description: 'Add participants to encounter',
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number' },
          participants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['character', 'npc'] },
                id: { type: 'number' },
                initiative: { type: 'number' }
              }
            }
          }
        },
        required: ['encounter_id', 'participants']
      }
    },
    {
      name: 'get_encounter_state',
      description: 'Get current encounter status',
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number' }
        },
        required: ['encounter_id']
      }
    },
    {
      name: 'next_turn',
      description: 'Advance to next turn in initiative',
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number' }
        },
        required: ['encounter_id']
      }
    },
    {
      name: 'end_encounter',
      description: 'End the current encounter',
      inputSchema: {
        type: 'object',
        properties: {
          encounter_id: { type: 'number' },
          outcome: { type: 'string', enum: ['victory', 'fled', 'defeat'] }
        },
        required: ['encounter_id']
      }
    },
    {
      name: 'apply_damage',
      description: 'Apply damage to character or NPC',
      inputSchema: {
        type: 'object',
        properties: {
          target_type: { type: 'string', enum: ['character', 'npc'] },
          target_id: { type: 'number' },
          damage: { type: 'number' }
        },
        required: ['target_type', 'target_id', 'damage']
      }
    },
    {
      name: 'get_active_encounter',
      description: 'Get the active encounter for a character',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number' }
        },
        required: ['character_id']
      }
    },
    {
      name: 'save_story_progress',
      description: 'Save story progress checkpoint for a character',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number', description: "ID of the character whose progress is being saved." },
          chapter: { type: 'string', description: "Current chapter of the story." },
          checkpoint: { type: 'string', description: "Specific checkpoint within the chapter." },
          summary: { type: 'string', description: "A brief summary of the events at this checkpoint." }
        },
        required: ["character_id", "chapter", "checkpoint", "summary"]
      }
    },
    // Quest Management Tools
    {
      name: 'add_quest',
      description: 'Add a new quest to the game master list',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Title of the quest' },
          description: { type: 'string', description: 'Detailed description of the quest' },
          objectives: {
            type: 'array',
            items: { type: 'string' }, // Or more complex objects: { type: 'object', properties: { id: {type: 'string'}, text: {type: 'string'}, completed: {type: 'boolean'}}}
            description: 'List of objectives for the quest (e.g., ["Defeat the dragon", "Retrieve the artifact"])'
          },
          rewards: {
            type: 'object',
            properties: {
              gold: { type: 'number' },
              experience: { type: 'number' },
              items: { type: 'array', items: { type: 'string' }, description: "Array of item names or IDs" }
            },
            description: 'Rewards for completing the quest'
          }
        },
        required: ['title', 'description', 'objectives', 'rewards']
      }
    },
    {
      name: 'get_active_quests',
      description: 'Get all active quests for a specific character',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number', description: 'ID of the character' }
        },
        required: ['character_id']
      }
    },
    {
      name: 'update_quest_state',
      description: 'Update the status or progress of a character\'s quest',
      inputSchema: {
        type: 'object',
        properties: {
          character_quest_id: { type: 'number', description: 'ID of the character-quest link (from character_quests table)' },
          status: { type: 'string', enum: ['active', 'completed', 'failed'], description: 'New status of the quest' },
          progress: {
            type: 'object',
            // Example: { "obj1_id": true, "obj2_id": false } or { "kill_count": 5, "total_needed": 10 }
            additionalProperties: true,
            description: 'JSON object detailing progress on specific objectives (optional)'
          }
        },
        required: ['character_quest_id', 'status']
      }
    },
    // New tool definition for assign_quest_to_character
    {
      name: 'assign_quest_to_character',
      description: 'Assign an existing quest to a character',
      inputSchema: {
        type: 'object',
        properties: {
          character_id: { type: 'number', description: 'ID of the character' },
          quest_id: { type: 'number', description: 'ID of the quest to assign' },
          status: { type: 'string', enum: ['active', 'completed', 'failed'], default: 'active', description: 'Initial status of the quest for the character' }
        },
        required: ['character_id', 'quest_id']
      }
    }
  ];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions
}));

// Handle --list-tools command line argument
if (process.argv.includes('--list-tools')) {
  console.log('Available tools:');
  toolDefinitions.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
  process.exit(0);
}

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
        const { character_id, items } = args as any;
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('The "items" parameter must be a non-empty array.');
        }
        
        const addedItemsResults = [];
        for (const item_to_add of items) {
          const { item_name: name, item_type = 'misc', quantity = 1, properties = {} } = item_to_add;
          if (!name) {
            // Skip item if name is missing, or throw an error for the whole batch
            console.warn('Skipping item due to missing name:', item_to_add);
            addedItemsResults.push({ name: 'Unnamed Item', status: 'skipped', reason: 'Missing item_name' });
            continue;
          }
          db.addItem(character_id, {
            name,
            type: item_type,
            quantity,
            properties
          });
          addedItemsResults.push({ name, quantity, status: 'added' });
        }
        
        return {
          content: [{ type: 'text', text: `Batch add items result: ${JSON.stringify(addedItemsResults, null, 2)}` }]
        };
      }

      case 'get_inventory': {
        const items = db.getInventory((args as any).character_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(items, null, 2) }]
        };
      }

      case 'remove_item': {
        const { item_ids } = args as any;
        if (!Array.isArray(item_ids) || item_ids.length === 0) {
          throw new Error('The "item_ids" parameter must be a non-empty array of numbers.');
        }

        const removedItemsResults = [];
        for (const item_id of item_ids) {
          if (typeof item_id !== 'number') {
            removedItemsResults.push({ id: item_id, status: 'skipped', reason: 'Invalid item_id type' });
            continue;
          }
          db.removeItem(item_id);
          removedItemsResults.push({ id: item_id, status: 'removed' });
        }
        return {
          content: [{ type: 'text', text: `Batch remove items result: ${JSON.stringify(removedItemsResults, null, 2)}` }]
        };
      }

      case 'update_item': {
        const { item_id, quantity, equipped } = args as any;
        const updates: any = {};
        if (quantity !== undefined) updates.quantity = quantity;
        if (equipped !== undefined) updates.equipped = equipped;
        
        db.updateItem(item_id, updates);
        return {
          content: [{ type: 'text', text: 'Item updated successfully' }]
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

     case 'update_world_state': {
       const { character_id, location, npcs, events, environment } = args as any;
       // Reusing db.saveWorldState as it handles updates if the record exists
       db.saveWorldState(character_id, { location, npcs, events, environment });
       return {
         content: [{ type: 'text', text: 'World state updated successfully' }]
       };
     }

     // NPC Management
     case 'create_npc': {
        const npc = db.createNPC(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(npc, null, 2) }]
        };
      }

      case 'create_npc_group': {
        const { template, count, namePrefix } = args as any;
        const npcs = db.createNPCGroup(template, count, namePrefix);
        return {
          content: [{ 
            type: 'text', 
            text: `Created ${npcs.length} ${template}s:\n${JSON.stringify(npcs, null, 2)}` 
          }]
        };
      }

      case 'get_npc': {
        const npc = db.getNPC((args as any).npc_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(npc, null, 2) }]
        };
      }

      case 'list_npcs': {
        const { type, aliveOnly = true } = args as any;
        const npcs = db.listNPCs(type, aliveOnly);
        return {
          content: [{ type: 'text', text: JSON.stringify(npcs, null, 2) }]
        };
      }

      case 'update_npc': {
        const { npc_id, updates } = args as any;
        const npc = db.updateNPC(npc_id, updates);
        return {
          content: [{ type: 'text', text: JSON.stringify(npc, null, 2) }]
        };
      }

      case 'remove_npc': {
        db.removeNPC((args as any).npc_id);
        return {
          content: [{ type: 'text', text: 'NPC removed from game' }]
        };
      }

      // Encounter Management
      case 'create_encounter': {
        const encounter = db.createEncounter(args as any) as Encounter;
        return {
          content: [{
            type: 'text',
            text: `Encounter "${encounter.name}" created!\n${JSON.stringify(encounter, null, 2)}`
          }]
        };
      }

      case 'add_to_encounter': {
        const { encounter_id, participants } = args as any;
        
        // Add each participant
        for (const p of participants) {
          db.addEncounterParticipant(encounter_id, p.type, p.id, p.initiative);
        }
        
        // Get updated encounter state
        const participants_list = db.getEncounterParticipants(encounter_id);
        
        return {
          content: [{ 
            type: 'text', 
            text: `Added ${participants.length} participants. Initiative order:\n${JSON.stringify(participants_list, null, 2)}` 
          }]
        };
      }

      case 'get_encounter_state': {
        const encounter_id = (args as any).encounter_id;
        const encounter = db.getEncounter(encounter_id) as Encounter | undefined;
        const participants = db.getEncounterParticipants(encounter_id) as EncounterParticipant[];
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ encounter, participants }, null, 2)
          }]
        };
      }

      case 'next_turn': {
        const next = db.nextTurn((args as any).encounter_id) as EncounterParticipant | null;
        
        if (next) {
          return {
            content: [{
              type: 'text',
              text: `It's ${next.name}'s turn! (Initiative: ${next.initiative})\n${JSON.stringify(next, null, 2)}`
            }]
          };
        } else {
          return {
            content: [{ type: 'text', text: 'No active encounter or no participants' }]
          };
        }
      }

      case 'end_encounter': {
        const { encounter_id, outcome = 'completed' } = args as any;
        db.endEncounter(encounter_id, outcome);
        return {
          content: [{ type: 'text', text: `Encounter ended: ${outcome}` }]
        };
      }

      case 'apply_damage': {
        const { target_type, target_id, damage } = args as any;
        const target = db.applyDamage(target_type, target_id, damage);
        
        const status = target.is_alive === false ? ' (DEFEATED!)' : '';
        return {
          content: [{ 
            type: 'text', 
            text: `Applied ${damage} damage. ${target.name} now has ${target.current_hp}/${target.max_hp} HP${status}` 
          }]
        };
      }

      case 'get_active_encounter': {
        const encounter = db.getActiveEncounter((args as any).character_id) as Encounter | undefined;
        if (encounter) {
          const participants = db.getEncounterParticipants(encounter.id) as EncounterParticipant[];
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ encounter, participants }, null, 2)
            }]
          };
        } else {
          return {
            content: [{ type: 'text', text: 'No active encounter' }]
          };
        }
      }

      case 'save_story_progress': {
        const { character_id, chapter, checkpoint, summary } = args as any;
        // The db method uses 'scene' for 'checkpoint' and 'description' for 'summary'
        db.saveStoryProgress(character_id, {
          chapter,
          scene: checkpoint, // Map checkpoint to scene
          description: summary, // Map summary to description
          // flags can be omitted or passed as null/empty if not provided by this tool's schema
        });
        return {
          content: [{ type: 'text', text: `Story progress saved for character ${character_id}: Chapter ${chapter}, Checkpoint ${checkpoint}` }]
        };
      }

      // Quest Management Handlers
      case 'add_quest': {
        const { title, description, objectives, rewards } = args as any;
        const quest = db.addQuest({ title, description, objectives, rewards });
        return {
          content: [{ type: 'text', text: `Quest added: ${JSON.stringify(quest, null, 2)}` }]
        };
      }

      case 'get_active_quests': {
        const { character_id } = args as any;
        // First, ensure the character exists to provide a better error message.
        const character = db.getCharacter(character_id);
        if (!character) {
          throw new Error(`Character with ID ${character_id} not found.`);
        }
        const activeQuests = db.getCharacterActiveQuests(character_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(activeQuests, null, 2) }]
        };
      }

      case 'update_quest_state': {
        const { character_quest_id, status, progress } = args as any;
        // Ensure the character_quest entry exists
        const existingCharacterQuest = db.getCharacterQuestById(character_quest_id);
        if (!existingCharacterQuest) {
            throw new Error(`Character quest link with ID ${character_quest_id} not found.`);
        }

        const updatedQuest = db.updateCharacterQuestStatus(character_quest_id, status, progress);
        if (updatedQuest) {
          return {
            content: [{ type: 'text', text: `Quest state updated: ${JSON.stringify(updatedQuest, null, 2)}` }]
          };
        } else {
          throw new Error(`Failed to update quest state for ID ${character_quest_id}.`);
        }
      }

      case 'assign_quest_to_character': {
        const { character_id, quest_id, status } = args as any;
        const assignedQuest = db.assignQuestToCharacter(character_id, quest_id, status);
        if (assignedQuest) {
          return {
            content: [{ type: 'text', text: `Quest assigned: ${JSON.stringify(assignedQuest, null, 2)}` }]
          };
        } else {
          // If assignQuestToCharacter returns null, it implies the assignment didn't proceed as expected
          // (e.g., quest already completed/failed and not overridden, or character/quest not found - though those should throw).
          // We can try to fetch the existing record to provide more context.
          // The db.assignQuestToCharacter method itself already tries to fetch the character_quest_id.
          // A simpler approach here is to rely on the fact that if it's null, an error or specific condition was met.
          // The method db.getCharacterQuestById requires the character_quest.id, not character_id and quest_id.
          // Let's refine the error message.
          return {
            content: [{ type: 'text', text: `Quest assignment for character ${character_id} and quest ${quest_id} resulted in no changes or an issue. The quest might already be in a terminal state (completed/failed) or one of the IDs is invalid.` }],
            isError: true
          };
        }
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
// Only log to stderr if not listing tools, as stdout is used for tool list
if (!process.argv.includes('--list-tools')) {
  console.error('RPG Game State MCP Server running on stdio');
}
